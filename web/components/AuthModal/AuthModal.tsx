import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FormHTMLAttributes, ReactNode, useMemo, useState } from "react";
import { FormikHelpers, useFormik } from "formik";

import { useAuth } from "providers";

import {
  loginValidationSchema,
  registerValidationSchema,
} from "./validationSchema";
import { errorMessage } from "@lib";

enum AuthType {
  login,
  register,
}

const titleMapper = {
  [AuthType.login]: "Log in",
  [AuthType.register]: "Register",
};

const helpTitleMapper = {
  [AuthType.login]: "Don't have an account?",
  [AuthType.register]: "Already have an account?",
};

const formikMapper = {
  [AuthType.login]: {
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidationSchema(),
  },
  [AuthType.register]: {
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerValidationSchema(),
  },
};

interface MyFormikValues {
  email: string;
  password: string;
  confirmPassword?: string;
}

const convertOppositeAuthType = (type: AuthType): AuthType =>
  type === AuthType.login ? AuthType.register : AuthType.login;

const Form = ({
  children,
  ...props
}: FormHTMLAttributes<HTMLFormElement> & { children?: ReactNode }) => (
  <form {...props}>{children}</form>
);
export default function AuthModal() {
  const toast = useToast();
  const [authType, setAuthType] = useState<AuthType>(AuthType.login);
  const [showPassword, setShowPassword] = useState(false);
  const {
    isVisibleAuthModal,
    closeAuthModal,
    registerWithEmailAndPassword,
    loginWithEmailAndPassword,
  } = useAuth();

  const onSubmitHandler = async (
    payload: MyFormikValues,
    helpers: FormikHelpers<MyFormikValues>
  ) => {
    try {
      switch (authType) {
        case AuthType.login:
          await loginWithEmailAndPassword({
            email: payload.email,
            password: payload.password,
          });
          break;
        case AuthType.register:
          await registerWithEmailAndPassword({
            email: payload.email,
            password: payload.password,
          });
          break;
        default:
          break;
      }
      handleCloseAuthModal();
    } catch (err) {
      toast({
        title: errorMessage(err),
        status: "error",
        isClosable: true,
        position: "top",
        duration: 4000,
      });
    } finally {
      helpers.setSubmitting(false);
    }
  };

  const {
    handleSubmit,
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    isSubmitting,
    resetForm,
  } = useFormik<MyFormikValues>({
    initialValues: formikMapper[authType].initialValues,
    validationSchema: formikMapper[authType].validationSchema,
    enableReinitialize: true,
    onSubmit: onSubmitHandler,
  });

  const handleSwitchPasswordType = () => setShowPassword((prev) => !prev);

  const handleCloseAuthModal = () => {
    setAuthType(AuthType.login);
    resetForm();
    closeAuthModal();
  };

  const switchAuthType = () => setAuthType(convertOppositeAuthType);

  const title = titleMapper[authType];

  const oppositeTitle = useMemo(
    () => titleMapper[convertOppositeAuthType(authType)],
    [authType]
  );

  const helpTitle = helpTitleMapper[authType];

  return (
    <Modal isOpen={isVisibleAuthModal} onClose={handleCloseAuthModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Form onSubmit={handleSubmit} className="space-y-4">
            <FormControl isInvalid={touched.email && !!errors.email}>
              <FormLabel fontSize="sm">Email</FormLabel>
              <Input
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                variant="filled"
                type="email"
                placeholder="Enter email"
              />
              <FormErrorMessage>
                {touched.email && errors.email}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={touched.password && !!errors.password}>
              <FormLabel fontSize="sm">Password</FormLabel>
              <InputGroup size="md">
                <Input
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  variant="filled"
                  pr="4.5rem"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={handleSwitchPasswordType}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>
                {touched.password && errors.password}
              </FormErrorMessage>
            </FormControl>
            {authType === AuthType.register && (
              <FormControl
                isInvalid={touched.confirmPassword && !!errors.confirmPassword}
              >
                <FormLabel fontSize="sm">Confirm Password</FormLabel>
                <InputGroup size="md">
                  <Input
                    name="confirmPassword"
                    value={values.confirmPassword || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="filled"
                    pr="4.5rem"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm password"
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={handleSwitchPasswordType}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {touched.confirmPassword && errors.confirmPassword}
                </FormErrorMessage>
              </FormControl>
            )}
            <FormControl>
              <Button
                type="submit"
                width="100%"
                colorScheme="purple"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {title}
              </Button>
            </FormControl>
          </Form>
        </ModalBody>

        <ModalFooter justifyContent="center" color="blackAlpha.700">
          <Text fontSize="sm" className="space-x-2">
            <span>{helpTitle}</span>
            <Button
              size="sm"
              variant="link"
              colorScheme="purple"
              className="underline"
              onClick={switchAuthType}
            >
              {oppositeTitle}
            </Button>
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
