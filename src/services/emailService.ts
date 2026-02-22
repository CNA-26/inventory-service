export const sendShippingEmail = async (
  email: string,
  orderId: string,
  trackingNumber: string
) => {

    // Placeholder URL, Logga, returnera ok. Change av comment.

  if (process.env.EMAIL_SERVICE_URL === "placeholder-url") {
    console.log("Email service in placeholder mode. Pretending email was sent.", {
      email,
      orderId,
      trackingNumber,
    });

    return { message: "Email sent in placeholder mode" };
  }

  const response = await fetch(
    `${process.env.EMAIL_SERVICE_URL}/shipping`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.EMAIL_SERVICE_API_KEY as string,
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
