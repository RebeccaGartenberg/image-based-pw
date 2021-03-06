#!/bin/bash

# fetch config from AWS for currently running infrastructure
source ./aws/load_config.sh

NOW=$(date '+%Y%m%d%H%M%S')
LOGFILE="./logs/cleanup-${NOW}.log"

INSTANCES_IPS=$(aws ec2 describe-instances ${PREAMBLE} --filters Name=instance-state-name,Values=running Name=tag:${APP_TAG_NAME},Values=${APP_TAG_VALUE} --query 'Reservations[*].Instances[*].PublicIpAddress' --output text | tr -s '\t' ' ')
echo "Public IP addresses: ${INSTANCES_IPS}" | tee -a ${LOGFILE}

for host in ${INSTANCES_IPS}
do
    scp -i ${KEY_FILE} ${USER}@${host}:${DATABASE_FILE} ~/Desktop/ | tee -a ${LOGFILE}
done

echo "Removing Full AWS infrastructure for ${APP_TAG_NAME}: ${APP_TAG_VALUE}" | tee ${LOGFILE}
echo "Running cleanup.sh at ${NOW}" | tee -a ${LOGFILE}

# terminate EC2 instance
echo "Terminate EC2 instances" | tee -a ${LOGFILE}
aws ec2 terminate-instances ${PREAMBLE} --instance-ids ${INSTANCES_IDS} | tee -a ${LOGFILE}
sleep 30

echo "Delete Key pair" | tee -a ${LOGFILE}
aws ec2 ${PREAMBLE} delete-key-pair --key-name ${KEY_NAME}
printf "yes\n" | rm ${KEY_FILE}

# remove route table association
echo "Remove route table association" | tee -a ${LOGFILE}
aws ec2 ${PREAMBLE} disassociate-route-table --association-id ${RT_TABLE_ASSN_ID} | tee -a ${LOGFILE}
sleep 10

# delete custom route in VPC
echo "Delete custom route in VPC" | tee -a ${LOGFILE}
aws ec2 delete-route ${PREAMBLE} --route-table-id ${RT_TABLE_ID} --destination-cidr-block 0.0.0.0/0 | tee -a ${LOGFILE}
sleep 10

# delete custom route table in VPC
echo "Delete custom route table in VPC" | tee -a ${LOGFILE}
aws ec2 delete-route-table ${PREAMBLE} --route-table-id ${RT_TABLE_ID} | tee -a ${LOGFILE}
sleep 10

# detach IGW from your VPC
echo "Detach IGW from VPC" | tee -a ${LOGFILE}
aws ec2 detach-internet-gateway ${PREAMBLE} --internet-gateway-id ${IGW_ID} --vpc-id ${VPC_ID} | tee -a ${LOGFILE}
sleep 10

# delete IGW
echo "Delete IGW" | tee -a ${LOGFILE}
aws ec2 delete-internet-gateway ${PREAMBLE} --internet-gateway-id ${IGW_ID} | tee -a ${LOGFILE}
sleep 10

# delete subnets
echo "Delete public subnet" | tee -a ${LOGFILE}
aws ec2 delete-subnet ${PREAMBLE} --subnet-id ${SN_ID_PUBLIC} | tee -a ${LOGFILE}
sleep 10

echo "Delete private subnet" | tee -a ${LOGFILE}
aws ec2 delete-subnet ${PREAMBLE} --subnet-id ${SN_ID_PRIVATE} | tee -a ${LOGFILE}
sleep 10

# delete sec group
echo "Delete security group" | tee -a ${LOGFILE}
aws ec2 delete-security-group ${PREAMBLE} --group-id ${SEC_GROUP_ID} | tee -a ${LOGFILE}
sleep 10

# delete your VPC
echo "Delete VPC" | tee -a ${LOGFILE}
aws ec2 delete-vpc ${PREAMBLE} --vpc-id ${VPC_ID} | tee -a ${LOGFILE}

echo "Done." | tee -a ${LOGFILE}

exit 0
