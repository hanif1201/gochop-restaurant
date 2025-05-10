import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { forgotPassword } from "../../services/authService";
import { useTheme } from "../../context/ThemeContext";
import { useAlert } from "../../context/AlertContext";
import Header from "../../components/common/Header";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [resetSent, setResetSent] = useState(false);

  const { theme } = useTheme();
  const { showAlert } = useAlert();

  const validate = () => {
    const newErrors = {};

    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await forgotPassword(email);
      setResetSent(true);
      showAlert("success", "Password reset instructions sent to your email");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to send reset instructions. Please try again.";
      showAlert("error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title='Forgot Password' showBackButton />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps='handled'
        >
          {resetSent ? (
            <View style={styles.successContainer}>
              <Text style={[styles.successTitle, { color: theme.colors.text }]}>
                Password Reset Email Sent
              </Text>
              <Text style={[styles.successText, { color: theme.colors.gray }]}>
                We&apos;ve sent an email to {email} with instructions to reset
                your password.
              </Text>
              <Button
                title='Back to Login'
                onPress={() => navigation.navigate("Login")}
                style={styles.button}
              />
            </View>
          ) : (
            <View style={styles.formContainer}>
              <Text style={[styles.instruction, { color: theme.colors.text }]}>
                Enter your email address below and we&apos;ll send you
                instructions to reset your password.
              </Text>

              <Input
                label='Email'
                value={email}
                onChangeText={setEmail}
                placeholder='Enter your email'
                keyboardType='email-address'
                autoCapitalize='none'
                icon='mail-outline'
                error={errors.email}
              />

              <Button
                title='Send Reset Instructions'
                onPress={handleSubmit}
                loading={loading}
                style={styles.button}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  formContainer: {
    marginBottom: 24,
  },
  instruction: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    marginTop: 16,
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  successText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
});

export default ForgotPasswordScreen;
