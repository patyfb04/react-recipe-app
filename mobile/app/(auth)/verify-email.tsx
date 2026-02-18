import {
  View,
  Text,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { authStyles } from "@/assets/styles/auth.styles";
import { Image } from "expo-image";
import { COLORS } from "@/constants/colors";
import { useState } from "react";
import { useSignUp } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";

const VerifyEmail = ({
  email,
  onBack,
}: {
  email: string;
  onBack: () => void;
}) => {
  const router = useRouter();
  const { signUp, setActive, isLoaded } = useSignUp();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");

  const handleVerification = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
      } else {
        Alert.alert("Error", "Email verification failed. Please try again.");
        setLoading(false);
        return;
      }
    } catch (err) {
      Alert.alert(
        "Error",
        err.errors?.[0]?.message ||
          "An unexpected error occurred during email verification.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView style={authStyles.container} behavior="padding">
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={authStyles.imageContainer}>
            <Image
              source={require("../../assets/images/i3.png")}
              style={authStyles.image}
              contentFit="contain"
            ></Image>
          </View>
          <Text style={authStyles.title}>Verify your email</Text>
          <Text style={authStyles.title}>
            We&apos;ve sent a verification code to {email}
          </Text>
          <View style={authStyles.formContainer}>
            <TextInput
              value={code}
              onChangeText={setCode}
              placeholder="Enter verification code"
              placeholderTextColor={COLORS.textLight}
              keyboardType="numeric"
              style={authStyles.textInput}
              autoCapitalize="none"
            />
          </View>
          <TouchableOpacity
            style={[
              authStyles.authButton,
              loading && authStyles.buttonDisabled,
            ]}
            onPress={handleVerification}
            disabled={loading}
          >
            <Text style={authStyles.buttonText}>
              {loading ? "Verifying..." : "Verify Email"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={authStyles.linkContainer} onPress={onBack}>
            <Text style={authStyles.linkText}>
              <Text style={authStyles.link}>Back to Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default VerifyEmail;
