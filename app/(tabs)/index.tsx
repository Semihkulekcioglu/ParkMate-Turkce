import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { getAuth, signOut } from 'firebase/auth';

export default function HomeScreen() {
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      router.replace('/(auth)/login');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🅿️ ParkMate</Text>
      <Text style={styles.subtitle}>Hoş Geldiniz!</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>

      <View style={styles.cardContainer}>
        <TouchableOpacity 
          style={styles.card}
          onPress={() => router.push('/qr')}
        >
          <FontAwesome name="qrcode" size={40} color="#00c3ff" />
          <Text style={styles.cardTitle}>PIN İşlemleri</Text>
          <Text style={styles.cardDescription}>
            Araç giriş ve çıkış işlemlerinizi PIN kodu ile gerçekleştirin
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push('/history')}>
          <FontAwesome name="history" size={40} color="#00c3ff" />
          <Text style={styles.cardTitle}>Geçmiş İşlemler</Text>
          <Text style={styles.cardDescription}>
            Önceki park işlemlerinizi görüntüleyin
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push('/payments')}>
          <FontAwesome name="credit-card" size={40} color="#00c3ff" />
          <Text style={styles.cardTitle}>Ödeme Geçmişi</Text>
          <Text style={styles.cardDescription}>
            Ödeme kayıtlarınızı inceleyin
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00c3ff',
    textAlign: 'center',
    marginTop: 40,
  },
  subtitle: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  logoutButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#222',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  logoutText: {
    color: '#ff5252',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardContainer: {
    gap: 20,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  cardDescription: {
    color: '#999',
    textAlign: 'center',
    fontSize: 14,
  },
});
