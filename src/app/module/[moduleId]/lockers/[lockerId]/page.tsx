import React from "react";

const LockerDetailsPage = async ({
  params,
}: {
  params: Promise<{ lockerId: string }>;
}) => {
  const { lockerId } = await params;
  return <div>LockerDetailsPage</div>;
};

export default LockerDetailsPage;
