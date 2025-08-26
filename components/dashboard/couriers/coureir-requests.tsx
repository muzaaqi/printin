"use client";
import { getAllCourierRequests } from "@/hooks/couriers/get-all-coureir-request";
import React, { useEffect, useState } from "react";
import CourierRequest from "./coureier-request";

const CourierRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    getAllCourierRequests((data) => {
      setRequests(data);
    }).then((unsub) => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);
  return (
    <div className="bg-muted dark:bg-muted/20 h-100 max-h-100 max-w-md rounded-xl p-4">
      <h1 className="mb-4 text-xl font-bold">Courier Requests</h1>
      <div className="h-90 max-h-90 max-w-md overflow-y-auto rounded-lg">
        <div className="space-y-3">
          {requests && requests.length > 0 ? (
            requests.filter((request) => request.status === null).length ===
            0 ? (
              <p>No new courier requests found.</p>
            ) : (
              requests
                .filter((request) => request.status === null)
                .map((request) => (
                  <CourierRequest key={request.id} request={request} />
                ))
            )
          ) : (
            <p>No courier requests found.</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default CourierRequests;
