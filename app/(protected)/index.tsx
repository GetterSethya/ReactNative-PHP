import { API, ICON_SIZE, todoStatus } from "@/constants/app";
import { colors } from "@/constants/color";
import { appResponseSchema, todoSchema } from "@/lib/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StyleSheet, View, Text, Pressable, Animated } from "react-native";
import * as secureStore from "expo-secure-store";
import { z } from "zod";
import { FlatList } from "react-native-gesture-handler";
import Checkbox from "expo-checkbox";
import { useRef, useState } from "react";
import { toast } from "sonner-native";
import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";

// TODO:
// get all by user
// create
// update

export default function TabOneScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const {
    data: todos,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const accessToken = await secureStore.getItemAsync("accessToken");
      const response = await fetch(API + "/", {
        method: "GET",
        headers: new Headers({ Authorization: accessToken ?? "" }),
      }).then(async (r) => {
        const data = appResponseSchema
          .extend({
            data: z.array(todoSchema),
          })
          .parse(await r.json());
        return data;
      });

      return response;
    },
  });

  if (!todos || isError || isLoading) {
    <View style={styles.container}>
      <Text style={styles.title}>Loading...</Text>
    </View>;
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        backgroundColor: colors.surface[50],
      }}
    >
      <FlatList
        style={{
          backgroundColor: colors.surface[50],
          flex: 1,
          flexDirection: "column",
        }}
        data={todos?.data}
        renderItem={(todo) => <TodoCard {...todo.item} />}
        contentContainerStyle={{ gap: 12, padding: 12 }}
      />
      <View
        style={{
          marginBottom: 24,
          alignItems: "flex-end",
          paddingRight: 24,
        }}
      >
        <Pressable
          onPress={() => {
            router.push({ pathname: "modal", params: { id: undefined } });
          }}
          style={({ pressed }) => ({
            backgroundColor: pressed ? "transparent" : colors.surface[200],
            borderRadius: ICON_SIZE,
            padding: 12,
            alignSelf: "flex-end",
          })}
        >
          <Ionicons name="add" size={ICON_SIZE} />
        </Pressable>
      </View>
    </View>
  );
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type TodoCardProps = {
  id?: number;
  user_id?: number;
  todo: string;
  status: (typeof todoStatus)[number];
};
const TodoCard = (props: TodoCardProps) => {
  const [isChecked, setChecked] = useState(
    props.status === "done" ? true : false,
  );
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const accessToken = await secureStore.getItemAsync("accessToken");
      const fd = new FormData();

      fd.append("todo_id", id.toString());

      const response = await fetch(API + "/delete", {
        method: "POST",
        headers: new Headers({ Authorization: accessToken ?? "" }),
        body: fd,
      }).then(async (r) => {
        const data = appResponseSchema.parse(await r.json());
        return { response: data, status: r.status };
      });
      return response;
    },
    mutationKey: ["todos", props.id],
    onSuccess: () => {
      toast.success("Berhasil menghapus todo");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: () => {
      toast.error("Gagal menghapus todo");
    },
  });

  const updateStatusMutation = useMutation({
    mutationKey: ["todos", props.id],
    mutationFn: async (data: {
      id: number;
      todo: string;
      status: (typeof todoStatus)[number];
    }) => {
      const accessToken = await secureStore.getItemAsync("accessToken");
      const fd = new FormData();
      fd.append("id", data.id.toString());
      fd.append("todo", data.todo);
      fd.append("status", data.status);

      const response = await fetch(API + "/update", {
        method: "POST",
        headers: new Headers({ Authorization: accessToken ?? "" }),
        body: fd,
      }).then(async (r) => {
        const response = await r.json();
        return response;
      });
      return response;
    },
    onSuccess: () => {
      toast.success("Berhasil mengupdate todo", { duration: 250 });
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (d) => {
      toast.error(`Gagal mengupdate todo ${d.message}`);
    },
  });

  const backgroundColorAnim = useRef(new Animated.Value(0)).current;
  const startBackgroundColorAnim = () => {
    Animated.timing(backgroundColorAnim, {
      toValue: 1,
      duration: 1800,
      useNativeDriver: false,
    }).start();
  };

  const resetBackgroundColorAnim = () => {
    Animated.timing(backgroundColorAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const backgroundColor = backgroundColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.surface[100], colors.error[200]],
  });

  return (
    <AnimatedPressable
      style={{
        padding: 24,
        backgroundColor: backgroundColor,
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderColor: colors.surface[500],
        borderWidth: 1,
      }}
      onLongPress={() => {
        if (props.id) {
          deleteMutation.mutate(props.id);
        }
      }}
      delayLongPress={1800}
      onPressIn={startBackgroundColorAnim}
      onPressOut={resetBackgroundColorAnim}
    >
      <View>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Todo</Text>
        <Text>{props.todo}</Text>
      </View>
      <Checkbox
        value={isChecked}
        onValueChange={(value) => {
          setChecked(value);
          if (props.id) {
            updateStatusMutation.mutate({
              id: props.id,
              todo: props.todo,
              status: value ? "done" : "pending",
            });
          }
        }}
        color={props.status ? colors.primary[500] : undefined}
      />
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface[50],
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
