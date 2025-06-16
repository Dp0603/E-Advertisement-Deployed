import { Box, Button, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import API from "../../../../api/axios"
import { jwtDecode } from "jwt-decode"
import { toast } from 'react-toastify';

export const ChangePassword = () => {

  const { register, handleSubmit } = useForm();
  const [password, setPassword] = useState({ data: {} });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token")
  const decodedToken = jwtDecode(token);
  const advertiserId = decodedToken.id;

  const submitHandler = async (data) => {
    setLoading(true);
    try {

      const res = await API.put(`/auth/updatepassword/${advertiserId}`, data)
      console.log(res.data);
      setPassword(res.data.data);
      toast.success(res?.data?.message);
      // setLoading(false)
    } catch (error) {
      toast.error(error.response?.data?.message);
      // setLoading(false)

    }

    setLoading(false);

  }
  return (
    <Box //start of parent box
      sx={{ mt: 10, ml: 1 }}
    >
      <Box borderBottom="1px solid" width={"80vw"}>
        <Typography variant='h4' sx={{ fontWeight: 'Bold' }}>Change password</Typography>
      </Box>

      <Box
        sx={{ mt: 5, ml: 4, p: 3 }}
        display={"flex"}
        flexDirection={"row"}

      >
        <form onSubmit={handleSubmit(submitHandler)}>
          <TextField

            fullWidth
            label="Current password"
            type='password'
            {...register("oldPassword")}


          ></TextField>

          <TextField
            sx={{ mt: 4 }}
            fullWidth
            label="New password"
            type='password'
            {...register("newPassword")}
          ></TextField>

          <TextField
            sx={{ mt: 4 }}
            fullWidth
            label="Confirm password"
            type='password'
            {...register("confirmPassword")}
          ></TextField>
          <Button
            type='submit'
            sx={{ mt: 2 }}
            variant='contained'
            disabled={loading}
          >
            {loading ? "Changing..." : "Change"}
          </Button>
        </form>
      </Box>

    </Box > //end of parent box
  )
}
