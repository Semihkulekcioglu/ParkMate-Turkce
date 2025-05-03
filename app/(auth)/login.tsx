import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const getFriendlyError = (code: string, message: string) => {
  switch (code) {
    case 'auth/invalid-email':
      return 'Geçersiz e-posta adresi girdiniz.';
    case 'auth/user-not-found':
      return 'Kullanıcı bulunamadı. Lütfen kayıt olun.';
    case 'auth/wrong-password':
      return 'Şifre yanlış. Lütfen tekrar deneyin.';
    default:
      return 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.';
  }
};

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleLogin = async () => {
    setErrorText('');
    if (!email || !password) {
      setErrorText('Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      const code = error.code || '';
      const message = error.message || '';
      setErrorText(getFriendlyError(code, message));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🅿️ ParkMate</Text>
      <Text style={styles.subtitle}>Giriş Yap</Text>

      {errorText ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorText}</Text>
        </View>
      ) : null}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="E-posta"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Giriş Yap</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.registerButton}
        onPress={() => router.push('/register')}
      >
        <Text style={styles.registerButtonText}>Hesabınız yok mu? Kayıt olun</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00c3ff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  errorBox: {
    backgroundColor: '#2d0000',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ff5252',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff5252',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
  inputContainer: {
    gap: 15,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#007aff',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButton: {
    marginTop: 20,
  },
  registerButtonText: {
    color: '#00c3ff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default LoginScreen;
