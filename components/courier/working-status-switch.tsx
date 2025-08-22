"use client"
import React, { useState } from 'react'
import { Switch } from '../ui/switch';

const WorkingStatusSwitch = () => {
  const [workingStatus, setWorkingStatus] = useState(false);
  const handleWorkingStatus = () => {
    setWorkingStatus(workingStatus);
    console.log(workingStatus)
  }
  return (
    <div>
      <Switch checked={workingStatus} onCheckedChange={handleWorkingStatus} />
    </div>
  );
}

export default WorkingStatusSwitch
