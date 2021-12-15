#!/bin/bash
if [[ -n $MIGRATE_DATABASE ]]; 
 then POSTGRES_EXTERNAL_URL=$MIGRATE_DATABASE prisma migrate deploy && POSTGRES_EXTERNAL_URL=$POSTGRES_EXTERNAL_URL; 
 else echo 'Skipping migration. No $MIGRATE_DATABASE' && echo $MIGRATE_DATABASE; 
fi