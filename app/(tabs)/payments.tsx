import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { db, ref, get } from '../../constants/firebaseConfig';

export default function PaymentsScreen() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const snapshot = await get(ref(db, 'logs'));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const arr = Object.values(data);
          // Sadece price alanı olanları (ödeme yapılanlar) göster
          setPayments(arr.filter((item: any) => item.price));
        } else {
          setPayments([]);
        }
      } catch (e) {
        setPayments([]);
      }
      setLoading(false);
    };
    fetchPayments();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ödeme Geçmişi</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#00c3ff" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.date}>{item.time ? item.time.substring(0, 10) : ''}</Text>
              <Text style={styles.info}>Tutar: {item.price} TL</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>Kayıt bulunamadı.</Text>}
        />
      )}
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
    color: '#00c3ff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  item: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  date: {
    color: '#00c3ff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  info: {
    color: '#fff',
    fontSize: 15,
    marginTop: 2,
  },
  empty: {
    color: '#bbb',
    textAlign: 'center',
    marginTop: 30,
  },
}); 