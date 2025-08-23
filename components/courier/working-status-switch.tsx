"use client"
import React, { useEffect, useState } from 'react'
import { Switch } from '../ui/switch';
import { toast } from 'sonner';
import { updateWorkingStatus } from '@/features/update-working-status';
import { GetCourierByIdRealtime } from '@/features/get-courier-by-id-realtime';

const WorkingStatusSwitch = ({userId} : {userId: string}) => {
  const [workingStatus, setWorkingStatus] = useState(false);
  const handleWorkingStatus = async () => {
    setWorkingStatus(!workingStatus);
    const res = await updateWorkingStatus(!workingStatus);
    if (res) {
      toast.success(
        `Working status changed to ${!workingStatus ? "active" : "inactive"}`, {
          position: "top-center",
        },
      );
    } else {
      toast.error(`Failed to change working status`, {
        position: "top-center"
      });
    }
  }

  useEffect(() => {
      let unsubscribe: (() => void) | undefined;
  
      GetCourierByIdRealtime((data) => {
        setWorkingStatus(data[0].working_status);
      }, userId).then((unsub) => {
        unsubscribe = unsub;
      });
  
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }, []);
  return (
    <div>
      <Switch checked={workingStatus} onCheckedChange={handleWorkingStatus} />
    </div>
  );
}

export default WorkingStatusSwitch
