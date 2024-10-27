import { StyleSheet, View, Text, Pressable } from "react-native";

import { useQuery } from "@tanstack/react-query";
import { API, ICON_SIZE } from "@/constants/app";
import * as secureStore from "expo-secure-store";
import { appResponseSchema, profileSchema } from "@/lib/zod";
import { colors } from "@/constants/color";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ProfilePage() {
  const router = useRouter();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const accessToken = await secureStore.getItemAsync("accessToken");
      const response = await fetch(API + "/profile", {
        method: "GET",
        headers: new Headers({ Authorization: accessToken ?? "" }),
      }).then(async (res) => {
        const status = res.status;
        const responseData = appResponseSchema
          .extend({
            data: profileSchema,
          })
          .parse(await res.json());

        return {
          response: responseData,
          status,
        };
      });

      return response;
    },
  });

  const handleLogout = async () => {
    await secureStore.deleteItemAsync("accessToken");
    router.replace("(auth)/login");
  };

  if (!data || isError || isLoading) {
    <View style={styles.container}>
      <Text style={styles.title}>Loading...</Text>
    </View>;
  }
  return (
    <View style={styles.container}>
      <View style={{ padding: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Profile</Text>
        <Text style={{ fontSize: 14, color: colors.surface[900] }}>
          Your account information
        </Text>
      </View>
      <View
        style={{
          padding: 12,
          gap: 12,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Ionicons name="person" size={ICON_SIZE * 1.2} />
        <View>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Name</Text>
          <Text style={{ fontSize: 14, color: colors.surface[900] }}>
            {data?.response.data.name}
          </Text>
        </View>
      </View>
      <View
        style={{
          padding: 12,
          gap: 12,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Ionicons name="mail" size={ICON_SIZE * 1.2} />
        <View>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Email</Text>
          <Text style={{ fontSize: 14, color: colors.surface[900] }}>
            {data?.response.data.email}
          </Text>
        </View>
      </View>
      <Pressable
        style={{
          padding: 12,
          backgroundColor: colors.primary[500],
          marginTop: 24,
          borderRadius: 8,
        }}
        onPress={() => handleLogout()}
      >
        <Text
          style={{ color: "white", fontWeight: "bold", textAlign: "center" }}
        >
          Logout
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: colors.surface[50],
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
  },
  desc: {
    fontSize: 20,
    fontWeight: "medium",
    textAlign: "left",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
