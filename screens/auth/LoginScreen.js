import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useAlert } from "../../context/AlertContext";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { login } from "../../services/authService";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { theme } = useTheme();
  const { showAlert } = useAlert();
  const { signIn } = React.useContext(AuthContext);

  const validate = () => {
    const newErrors = {};

    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await login(email, password);
      console.log("Login Response:", response);

      // Get user data and role directly from response
      const userData = response.user;
      const userRole = userData.role;

      // Check if user has restaurant role
      if (userRole !== "restaurant") {
        showAlert(
          "error",
          "You are not authorized to access the restaurant dashboard"
        );
        return;
      }

      // Get tokens directly from response
      const token = response.token;
      const refreshToken = response.refreshToken;

      if (!token || !refreshToken) {
        console.error("Missing tokens in response:", response);
        throw new Error("Login response missing required tokens");
      }

      // Pass the tokens and user data to signIn
      await signIn(token, userData, refreshToken);
      showAlert("success", "Login successful");
    } catch (error) {
      console.error("Login error:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";
      showAlert("error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps='handled'
        >
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/logo.png")}
              style={styles.logo}
              resizeMode='contain'
            />
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Restaurant Admin
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.gray }]}>
              Login to manage your restaurant
            </Text>
          </View>

          <View style={styles.formContainer}>
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

            <Input
              label='Password'
              value={password}
              onChangeText={setPassword}
              placeholder='Enter your password'
              secureTextEntry
              icon='lock-closed-outline'
              error={errors.password}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
              style={styles.forgotPassword}
            >
              <Text
                style={[
                  styles.forgotPasswordText,
                  { color: theme.colors.primary },
                ]}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <Button
              title='Login'
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />
          </View>
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
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  formContainer: {
    marginBottom: 24,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  loginButton: {
    marginTop: 8,
  },
});

export default LoginScreen;
