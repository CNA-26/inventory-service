export const sendShippingEmail = async (
  email: string,
  orderId: string,
  trackingNumber: string
) => {
  const response = await fetch(
    `${process.env.EMAIL_SERVICE_URL}/shipping`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.EMAIL_SERVICE_API_KEY as string,
      },
      body: JSON.stringify({
        email,
        orderId,
        trackingNumber,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Email service error: ${response.status}`);
  }

  return response.json();
};
