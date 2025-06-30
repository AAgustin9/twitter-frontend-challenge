import type { ChangeEvent } from "react";
import React, { useState } from "react";
import logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthWrapper from "../../../pages/auth/AuthWrapper";
import { useHttpRequestService } from "../../../service/HttpRequestService";
import LabeledInput from "../../../components/labeled-input/LabeledInput";
import Button from "../../../components/button/Button";
import { ButtonType } from "../../../components/button/StyledButton";
import { StyledH3 } from "../../../components/common/text";
import * as Yup from "yup";
import { useFormik } from "formik";

interface SignUpData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
const SignUpPage = () => {

  const httpRequestService = useHttpRequestService();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const initialValues = {
    name: "", 
    username: "", 
    email: "", 
    password: "", 
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(t("error.required")),
    username: Yup.string().required(t("error.required")),
    email: Yup.string()
      .email(t("error.invalidEmail"))
      .required(t("error.required")),
    password: Yup.string()
      .min(6, t("error.passwordTooShort"))
      .required(t("error.required")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], t("error.passwordMismatch"))
      .required(t("error.required")),
  });

  const formik = useFormik<SignUpData>({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const { confirmPassword, ...data } = values;
        await httpRequestService.signUp(data);
        navigate("/");
      } catch (err) {
        setErrors({ email: t("error.signupFailed") });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <AuthWrapper>
      <form onSubmit={formik.handleSubmit}>
        <div className={"border"}>
          <div className={"container"}>
            <div className={"header"}>
              <img src={logo} alt="Twitter Logo" />
              <StyledH3>{t("title.register")}</StyledH3>
            </div>
            <div className={"input-container"}>
              <LabeledInput
                required
                placeholder={"Enter name..."}
                title={t("input-params.name")}
                error={!!formik.errors.name && formik.touched.name}
                value={formik.values.name}
                onChange={formik.handleChange}
                name="name"
              />
              <LabeledInput
                required
                placeholder={"Enter username..."}
                title={t("input-params.username")}
                error={!!formik.errors.username && formik.touched.username}
                value={formik.values.username}
                onChange={formik.handleChange}
                name="username"
              />
              <LabeledInput
                required
                placeholder={"Enter email..."}
                title={t("input-params.email")}
                error={!!formik.errors.email && formik.touched.email}
                value={formik.values.email}
                onChange={formik.handleChange}
                name="email"
              />
              <LabeledInput
                type="password"
                required
                placeholder={"Enter password..."}
                title={t("input-params.password")}
                error={!!formik.errors.password && formik.touched.password}
                value={formik.values.password}
                onChange={formik.handleChange}
                name="password"
              />
              <LabeledInput
                type="password"
                required
                placeholder={"Confirm password..."}
                title={t("input-params.confirm-password")}
                error={!!formik.errors.confirmPassword && formik.touched.confirmPassword}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                name="confirmPassword"
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Button
                text={t("buttons.register")}
                buttonType={ButtonType.FOLLOW}
                size={"MEDIUM"}
                onClick={formik.submitForm}
              />
              <Button
                text={t("buttons.login")}
                buttonType={ButtonType.OUTLINED}
                size={"MEDIUM"}
                onClick={() => navigate("/sign-in")}
              />
            </div>
          </div>
        </div>
      </form>
    </AuthWrapper>
  );
};


export default SignUpPage;
