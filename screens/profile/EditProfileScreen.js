import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { updateRestaurantDetails } from "../../services/restaurantService";
import { useTheme } from "../../context/ThemeContext";
import { useAlert } from "../../context/AlertContext";
import Header from "../../components/common/Header";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const EditProfileScreen = ({ navigation, route }) => {
  const { restaurant } = route.params;
  const { theme } = useTheme();
  const { showAlert } = useAlert();

  const [formData, setFormData] = useState({
    name: restaurant.name || "",
    description: restaurant.description || "",
    email: restaurant.email || "",
    phone: restaurant.phone || "",
    address: restaurant.address || "",
    cuisineType: (restaurant.cuisineType || []).join(", "),
    minimumOrder: restaurant.minimumOrder?.toString() || "0",
    deliveryFee: restaurant.deliveryFee?.toString() || "0",
    deliveryTime: restaurant.deliveryTime?.toString() || "30",
    logo: null,
    coverImage: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [originalLogo, setOriginalLogo] = useState(restaurant.logo);
  const [originalCoverImage, setOriginalCoverImage] = useState(
    restaurant.coverImage
  );

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    // Clear error when field is edited
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };

  const pickImage = async (type) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: type === "logo" ? [1, 1] : [16, 9],
        quality: 0.8,
      });

      if (!result.cancelled && result.assets && result.assets[0].uri) {
        handleChange(type, result.assets[0].uri);
      }
    } catch (error) {
      console.log(`Error picking ${type}:`, error);
      showAlert("error", `Failed to pick ${type}`);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.cuisineType)
      newErrors.cuisineType = "Cuisine type is required";

    if (
      formData.minimumOrder &&
      (isNaN(parseFloat(formData.minimumOrder)) ||
        parseFloat(formData.minimumOrder) < 0)
    ) {
      newErrors.minimumOrder = "Minimum order must be a non-negative number";
    }

    if (
      formData.deliveryFee &&
      (isNaN(parseFloat(formData.deliveryFee)) ||
        parseFloat(formData.deliveryFee) < 0)
    ) {
      newErrors.deliveryFee = "Delivery fee must be a non-negative number";
    }

    if (
      formData.deliveryTime &&
      (isNaN(parseInt(formData.deliveryTime)) ||
        parseInt(formData.deliveryTime) <= 0)
    ) {
      newErrors.deliveryTime = "Delivery time must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      // Prepare form data for API
      const restaurantData = {
        ...formData,
        cuisineType: formData.cuisineType.split(",").map((item) => item.trim()),
        minimumOrder: parseFloat(formData.minimumOrder),
        deliveryFee: parseFloat(formData.deliveryFee),
        deliveryTime: parseInt(formData.deliveryTime),
      };

      // Handle image uploads
      if (formData.logo) {
        // In a real app, you would upload the image and get a URL back
        restaurantData.logo = formData.logo;
      } else if (originalLogo) {
        restaurantData.logo = originalLogo;
      }

      if (formData.coverImage) {
        // In a real app, you would upload the image and get a URL back
        restaurantData.coverImage = formData.coverImage;
      } else if (originalCoverImage) {
        restaurantData.coverImage = originalCoverImage;
      }

      await updateRestaurantDetails(restaurant._id, restaurantData);
      showAlert("success", "Restaurant profile updated successfully");
      navigation.goBack();
    } catch (error) {
      console.log("Error updating restaurant profile:", error);
      showAlert("error", "Failed to update restaurant profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title='Edit Restaurant Profile' showBackButton />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Cover Image Upload */}
          <TouchableOpacity
            style={[
              styles.coverImageContainer,
              { borderColor: theme.colors.border },
            ]}
            onPress={() => pickImage("coverImage")}
          >
            {formData.coverImage ? (
              <Image
                source={{ uri: formData.coverImage }}
                style={styles.coverImage}
              />
            ) : originalCoverImage ? (
              <Image
                source={{ uri: originalCoverImage }}
                style={styles.coverImage}
              />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Ionicons
                  name='image-outline'
                  size={40}
                  color={theme.colors.gray}
                />
                <Text style={[styles.uploadText, { color: theme.colors.gray }]}>
                  Tap to upload cover image
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Logo Upload */}
          <View style={styles.logoContainer}>
            <TouchableOpacity
              style={[styles.logoWrapper, { borderColor: theme.colors.border }]}
              onPress={() => pickImage("logo")}
            >
              {formData.logo ? (
                <Image source={{ uri: formData.logo }} style={styles.logo} />
              ) : originalLogo ? (
                <Image source={{ uri: originalLogo }} style={styles.logo} />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Ionicons
                    name='restaurant-outline'
                    size={30}
                    color={theme.colors.gray}
                  />
                </View>
              )}
            </TouchableOpacity>
          </View>

          <Input
            label='Restaurant Name'
            value={formData.name}
            onChangeText={(text) => handleChange("name", text)}
            placeholder='Enter restaurant name'
            error={errors.name}
          />

          <Input
            label='Description'
            value={formData.description}
            onChangeText={(text) => handleChange("description", text)}
            placeholder='Enter restaurant description'
            multiline
            numberOfLines={3}
            error={errors.description}
          />

          <Input
            label='Email'
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
            placeholder='Enter restaurant email'
            keyboardType='email-address'
            autoCapitalize='none'
            error={errors.email}
          />

          <Input
            label='Phone'
            value={formData.phone}
            onChangeText={(text) => handleChange("phone", text)}
            placeholder='Enter restaurant phone'
            keyboardType='phone-pad'
            error={errors.phone}
          />

          <Input
            label='Address'
            value={formData.address}
            onChangeText={(text) => handleChange("address", text)}
            placeholder='Enter restaurant address'
            multiline
            numberOfLines={2}
            error={errors.address}
          />

          <Input
            label='Cuisine Types (comma-separated)'
            value={formData.cuisineType}
            onChangeText={(text) => handleChange("cuisineType", text)}
            placeholder='e.g. Italian, Pasta, Pizza'
            error={errors.cuisineType}
          />

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Delivery Settings
          </Text>

          <View style={styles.row}>
            <Input
              label='Minimum Order ($)'
              value={formData.minimumOrder}
              onChangeText={(text) => handleChange("minimumOrder", text)}
              placeholder='0.00'
              keyboardType='decimal-pad'
              error={errors.minimumOrder}
              style={styles.halfInput}
            />

            <Input
              label='Delivery Fee ($)'
              value={formData.deliveryFee}
              onChangeText={(text) => handleChange("deliveryFee", text)}
              placeholder='0.00'
              keyboardType='decimal-pad'
              error={errors.deliveryFee}
              style={styles.halfInput}
            />
          </View>

          <Input
            label='Estimated Delivery Time (minutes)'
            value={formData.deliveryTime}
            onChangeText={(text) => handleChange("deliveryTime", text)}
            placeholder='30'
            keyboardType='number-pad'
            error={errors.deliveryTime}
          />

          <Button
            title='Save Changes'
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  coverImageContainer: {
    height: 150,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    marginBottom: 50, // Make space for overlapping logo
    overflow: "hidden",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  logoContainer: {
    position: "relative",
    alignItems: "center",
    marginTop: -50, // Overlap with cover image
    marginBottom: 16,
  },
  logoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadText: {
    marginTop: 8,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  submitButton: {
    marginTop: 24,
  },
});

export default EditProfileScreen;
