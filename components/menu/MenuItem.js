import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import Badge from "../common/Badge";

const MenuItem = ({ item, onPress, onToggleAvailability }) => {
  const { theme } = useTheme();

  // Placeholder image for menu items without images
  const placeholderImage = require("../../assets/placeholder-food.png");

  // Format the price to always show 2 decimal places
  const formattedPrice = `$${parseFloat(item.price).toFixed(2)}`;

  // Check if the item has dietary requirements
  const hasDietaryInfo = item.isVeg || item.isVegan || item.isGlutenFree;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Item Image */}
      <View style={styles.imageContainer}>
        <Image
          source={item.image ? { uri: item.image } : placeholderImage}
          style={styles.image}
          resizeMode='cover'
        />

        {item.featured && (
          <View
            style={[
              styles.featuredBadge,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
      </View>

      {/* Item Details */}
      <View style={styles.details}>
        <View style={styles.nameRow}>
          <Text
            style={[styles.name, { color: theme.colors.text }]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text style={[styles.price, { color: theme.colors.primary }]}>
            {formattedPrice}
          </Text>
        </View>

        <Text
          style={[styles.description, { color: theme.colors.gray }]}
          numberOfLines={2}
        >
          {item.description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.infoContainer}>
            {/* Preparation Time */}
            <View style={styles.infoItem}>
              <Ionicons
                name='time-outline'
                size={14}
                color={theme.colors.gray}
              />
              <Text style={[styles.infoText, { color: theme.colors.gray }]}>
                {item.preparationTime} min
              </Text>
            </View>

            {/* Category */}
            <Badge
              text={item.category}
              type='info'
              size='small'
              style={styles.categoryBadge}
            />

            {/* Dietary Badges */}
            {hasDietaryInfo && (
              <View style={styles.dietaryBadges}>
                {item.isVeg && (
                  <View
                    style={[
                      styles.dietaryBadge,
                      { backgroundColor: theme.colors.success + "30" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dietaryText,
                        { color: theme.colors.success },
                      ]}
                    >
                      V
                    </Text>
                  </View>
                )}
                {item.isVegan && (
                  <View
                    style={[
                      styles.dietaryBadge,
                      { backgroundColor: theme.colors.success + "30" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dietaryText,
                        { color: theme.colors.success },
                      ]}
                    >
                      Ve
                    </Text>
                  </View>
                )}
                {item.isGlutenFree && (
                  <View
                    style={[
                      styles.dietaryBadge,
                      { backgroundColor: theme.colors.warning + "30" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dietaryText,
                        { color: theme.colors.warning },
                      ]}
                    >
                      GF
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Availability Switch */}
          <View style={styles.availabilityContainer}>
            <Text
              style={[styles.availabilityLabel, { color: theme.colors.gray }]}
            >
              {item.available ? "Available" : "Unavailable"}
            </Text>
            <Switch
              value={item.available}
              onValueChange={() => onToggleAvailability(item._id)}
              trackColor={{
                false: "#D1D1D6",
                true: theme.colors.primary + "80",
              }}
              thumbColor={item.available ? theme.colors.primary : "#F4F3F4"}
              style={styles.switch}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  imageContainer: {
    width: 100,
    height: 100,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  featuredBadge: {
    position: "absolute",
    top: 0,
    left: 0,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderBottomRightRadius: 6,
  },
  featuredText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  details: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  infoText: {
    fontSize: 12,
    marginLeft: 4,
  },
  categoryBadge: {
    marginRight: 8,
  },
  dietaryBadges: {
    flexDirection: "row",
  },
  dietaryBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },
  dietaryText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  availabilityContainer: {
    alignItems: "flex-end",
  },
  availabilityLabel: {
    fontSize: 10,
    marginBottom: 2,
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
});

export default MenuItem;
