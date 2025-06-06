import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { createMenuItem } from "../../services/menuService";
import { useTheme } from "../../context/ThemeContext";
import { useAlert } from "../../context/AlertContext";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/common/Header";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const AddMenuItemScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { showAlert } = useAlert();
  const { userInfo } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    preparationTime: "",
    isVeg: false,
    isVegan: false,
    isGlutenFree: false,
    image: null,
    featured: false,
    available: true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.cancelled && result.assets && result.assets[0].uri) {
        handleChange("image", result.assets[0].uri);
      }
    } catch (error) {
      console.log("Error picking image:", error);
      showAlert("error", "Failed to pick image");
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.price) newErrors.price = "Price is required";
    else if (
      isNaN(parseFloat(formData.price)) ||
      parseFloat(formData.price) <= 0
    ) {
      newErrors.price = "Price must be a positive number";
    }

    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.preparationTime)
      newErrors.preparationTime = "Preparation time is required";
    else if (
      isNaN(parseInt(formData.preparationTime)) ||
      parseInt(formData.preparationTime) <= 0
    ) {
      newErrors.preparationTime = "Preparation time must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      // Prepare the form data for API
      const menuItemData = {
        ...formData,
        restaurant: userInfo.restaurantId,
        price: parseFloat(formData.price),
        preparationTime: parseInt(formData.preparationTime),
      };

      // Handle image upload - this would typically involve uploading to a server
      // For now, we'll just use the URI as a placeholder
      if (formData.image) {
        // In a real app, you would upload the image and get a URL back
        menuItemData.image = formData.image;
      }

      await createMenuItem(menuItemData);
      showAlert("success", "Menu item added successfully");
      navigation.goBack();
    } catch (error) {
      console.log("Error adding menu item:", error);
      showAlert("error", "Failed to add menu item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title='Add Menu Item' showBackButton />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Image Upload */}
          <TouchableOpacity
            style={[
              styles.imageContainer,
              { borderColor: theme.colors.border },
            ]}
            onPress={pickImage}
          >
            {formData.image ? (
              <Image
                source={{ uri: formData.image }}
                style={styles.previewImage}
              />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Ionicons
                  name='camera-outline'
                  size={40}
                  color={theme.colors.gray}
                />
                <Text style={[styles.uploadText, { color: theme.colors.gray }]}>
                  Tap to upload image
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <Input
            label='Item Name'
            value={formData.name}
            onChangeText={(text) => handleChange("name", text)}
            placeholder='Enter menu item name'
            error={errors.name}
          />

          <Input
            label='Description'
            value={formData.description}
            onChangeText={(text) => handleChange("description", text)}
            placeholder='Enter item description'
            multiline
            numberOfLines={3}
            error={errors.description}
          />

          <View style={styles.row}>
            <Input
              label='Price'
              value={formData.price}
              onChangeText={(text) => handleChange("price", text)}
              placeholder='0.00'
              keyboardType='decimal-pad'
              error={errors.price}
              style={styles.halfInput}
            />

            <Input
              label='Preparation Time (min)'
              value={formData.preparationTime}
              onChangeText={(text) => handleChange("preparationTime", text)}
              placeholder='15'
              keyboardType='number-pad'
              error={errors.preparationTime}
              style={styles.halfInput}
            />
          </View>

          <Input
            label='Category'
            value={formData.category}
            onChangeText={(text) => handleChange("category", text)}
            placeholder='e.g. Main Course, Appetizer, Dessert'
            error={errors.category}
          />

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Dietary Information
          </Text>

          <View style={styles.switchContainer}>
            <Text style={[styles.switchLabel, { color: theme.colors.text }]}>
              Vegetarian
            </Text>
            <Switch
              value={formData.isVeg}
              onValueChange={(value) => handleChange("isVeg", value)}
              trackColor={{
                false: "#D1D1D6",
                true: theme.colors.primary + "80",
              }}
              thumbColor={formData.isVeg ? theme.colors.primary : "#F4F3F4"}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={[styles.switchLabel, { color: theme.colors.text }]}>
              Vegan
            </Text>
            <Switch
              value={formData.isVegan}
              onValueChange={(value) => handleChange("isVegan", value)}
              trackColor={{
                false: "#D1D1D6",
                true: theme.colors.primary + "80",
              }}
              thumbColor={formData.isVegan ? theme.colors.primary : "#F4F3F4"}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={[styles.switchLabel, { color: theme.colors.text }]}>
              Gluten Free
            </Text>
            <Switch
              value={formData.isGlutenFree}
              onValueChange={(value) => handleChange("isGlutenFree", value)}
              trackColor={{
                false: "#D1D1D6",
                true: theme.colors.primary + "80",
              }}
              thumbColor={
                formData.isGlutenFree ? theme.colors.primary : "#F4F3F4"
              }
            />
          </View>

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Item Options
          </Text>

          <View style={styles.switchContainer}>
            <Text style={[styles.switchLabel, { color: theme.colors.text }]}>
              Featured Item
            </Text>
            <Switch
              value={formData.featured}
              onValueChange={(value) => handleChange("featured", value)}
              trackColor={{
                false: "#D1D1D6",
                true: theme.colors.primary + "80",
              }}
              thumbColor={formData.featured ? theme.colors.primary : "#F4F3F4"}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={[styles.switchLabel, { color: theme.colors.text }]}>
              Available
            </Text>
            <Switch
              value={formData.available}
              onValueChange={(value) => handleChange("available", value)}
              trackColor={{
                false: "#D1D1D6",
                true: theme.colors.primary + "80",
              }}
              thumbColor={formData.available ? theme.colors.primary : "#F4F3F4"}
            />
          </View>

          <Button
            title='Add Menu Item'
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
  imageContainer: {
    height: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    marginBottom: 16,
    overflow: "hidden",
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
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  switchLabel: {
    fontSize: 16,
  },
  submitButton: {
    marginTop: 24,
  },
});

export default AddMenuItemScreen;
