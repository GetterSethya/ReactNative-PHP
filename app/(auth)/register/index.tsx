import { RegisterForm, appResponseSchema, registerSchema } from "@/lib/zod";
import { useForm, Controller } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { API } from "@/constants/app";
import { Link, useRouter } from "expo-router";
import { colors } from "@/constants/color";

export default function RegisterPage() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterForm>({
    mode: "all",
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      passwordConfirm: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: RegisterForm) => {
      const fd = new FormData();

      fd.append("email", data.email);
      fd.append("name", data.name);
      fd.append("password", data.password);

      const response = await fetch(API + "/register", {
        method: "POST",
        body: fd,
      }).then(async (r) => {
        const responseData = await r.json();
        const parsed = appResponseSchema.parse(responseData);
        return {
          response: parsed,
          status: r.status,
        };
      });

      return response;
    },
    onSuccess: async ({ status, response }) => {
      if (status !== 200) {
        toast.error(response.message);
        setError("email", { message: response.message });
        setError("name", { message: response.message });
        setError("password", { message: response.message });
        setError("passwordConfirm", { message: response.message });
        return;
      }

      toast.success(`Register success`);
      router.replace("/(auth)/login/");
    },
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface[50] }}>
      <View
        style={{
          padding: 16,
          margin: "auto",
          width: "100%",
          gap: 12,
        }}
      >
        <View style={{ paddingVertical: 12 }}>
          <Text style={{ fontSize: 24, fontWeight: "600" }}>Register</Text>
          <Text style={{ fontSize: 18, fontWeight: "400" }}>
            Please fill the form to continue
          </Text>
        </View>
        <View>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
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
            name="email"
          />
          {errors.email && (
            <Text style={{ color: colors.error[500] }}>
              {errors.email.message}
            </Text>
          )}
        </View>
        <View>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
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
            name="name"
          />
          {errors.name && (
            <Text style={{ color: colors.error[500] }}>
              {errors.name.message}
            </Text>
          )}
        </View>
        <View style={{ backgroundColor: "transparent" }}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
                style={{
                  padding: 12,
                  borderWidth: 1,
                  borderColor: colors.surface[500],
                  borderRadius: 8,
                  backgroundColor: "white",
                }}
                placeholderTextColor={colors.surface[950]}
              />
            )}
            name="password"
          />
          {errors.password && (
            <Text style={{ color: colors.error[500] }}>
              {errors.password.message}
            </Text>
          )}
        </View>
        <View style={{ backgroundColor: "transparent" }}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Confirm Password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
                style={{
                  padding: 12,
                  borderWidth: 1,
                  borderColor: colors.surface[500],
                  borderRadius: 8,
                  backgroundColor: "white",
                }}
                placeholderTextColor={colors.surface[950]}
              />
            )}
            name="passwordConfirm"
          />
          {errors.passwordConfirm && (
            <Text style={{ color: colors.error[500] }}>
              {errors.passwordConfirm.message}
            </Text>
          )}
        </View>
        <Pressable
          onPress={handleSubmit((data) => {
            loginMutation.mutate(data);
          })}
          style={{
            backgroundColor: colors.primary[500],
            padding: 12,
            borderRadius: 8,
          }}
        >
          <Text
            style={{ color: "white", fontWeight: "600", textAlign: "center" }}
          >
            Register
          </Text>
        </Pressable>

        <Link href={"/login"}>
          <Text>Already have an account?</Text>
          <Text style={{ color: colors.primary[500] }}>Login</Text>
        </Link>
      </View>
    </View>
  );
}
