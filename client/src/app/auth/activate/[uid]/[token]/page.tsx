"use client";

import React, { useEffect } from "react";
import axios from "axios";

const ActivateAccount = ({
  params,
}: {
  params: { uid: string; token: string };
}) => {
  const { uid, token } = params;
  useEffect(() => {
    axios
      .post(`${process.env.API_URL}/auth/users/activation/`, { uid, token })
      .then((response) => {
        // Handle successful activation
        console.log(response);
      })
      .catch((error) => {
        // Handle activation error
        console.log(error);
      });
  }, [uid, token]);

  return (
    <h2 className="p-8 mx-auto text-xl text-center text-bold">
      Account is activated
    </h2>
  );
};

export default ActivateAccount;
