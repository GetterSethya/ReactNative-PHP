import { API, ICON_SIZE } from "@/constants/app";
import { colors } from "@/constants/color";
import { Todo, appResponseSchema, todoSchema } from "@/lib/zod";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { View, Text, TextInput, Pressable } from "react-native";
import { toast } from "sonner-native";
import * as secureStore from "expo-secure-store";

export type TodoModalProps = {
  id?: number;
};
export default function TodoModal() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();

  // useEffect(() => {
  //   if (id) {
  //     router.setParams({ title: "Update todo" });
  //     toast.success(id.toString());
  //   }
  // }, [id]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Pick<Todo, "todo" | "id">>({
    mode: "all",
    resolver: zodResolver(todoSchema.pick({ todo: true })),
    defaultValues: {
      todo: "",
    },
  });


  const createTodoMutation = useMutation({
    mutationFn: async (data: Pick<Todo, "todo">) => {
      const accessToken = await secureStore.getItemAsync("accessToken");

      const fd = new FormData();
      fd.append("todo", data.todo);

      const response = await fetch(API + "/", {
        method: "POST",
        headers: new Headers({ Authorization: accessToken ?? "" }),
        body: fd,
      }).then(async (r) => {
        const dataJson = await r.json();
        const response = appResponseSchema.parse(dataJson);
        return {
          response,
          status: r.status,
        };
      });

      return response;
    },
    mutationKey: ["todo", id],
    onSuccess: ({ status, response }) => {
      if (status !== 201) {
        toast.error(`Gagal menyimpan todo: ${response.message}`);
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["todo", id] });
      router.replace("/(protected)/");

      if (id) {
        toast.success("Berhasil mengupdate todo");
        return;
      }

      toast.success("Berhasil membuat todo");
    },
    onError: () => {
      toast.error("Gagal menyimpan todo");
    },
  });

  return (
    <View style={{ backgroundColor: colors.surface[50], flex: 1 }}>
      <View style={{ padding: 12, marginTop: 24, gap: 12 }}>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Todo"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value ? value.toString() : ""}
              style={{
                padding: 12,
                borderWidth: 1,
                borderColor: colors.surface[500],
                borderRadius: 8,
                backgroundColor: "white",
                color: "black",
              }}
              placeholderTextColor={colors.surface[950]}
            />
          )}
          name="todo"
        />
        {errors.todo && (
          <Text style={{ color: colors.error[500] }}>
            {errors.todo.message}
          </Text>
        )}
        <Pressable
          onPress={handleSubmit((data) => {
            createTodoMutation.mutate(data);
          })}
          style={{
            backgroundColor: colors.primary[500],
            padding: 12,
            borderRadius: 8,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="save"
              size={ICON_SIZE}
              color={colors.primary[100]}
            />
            <Text
              style={{
                color: "white",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              Save
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
