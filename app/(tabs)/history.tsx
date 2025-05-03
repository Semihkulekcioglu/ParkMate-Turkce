import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { db, ref, get } from '../../constants/firebaseConfig';

export default function HistoryScreen() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const snapshot = await get(ref(db, 'logs'));
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Tüm logları diziye çevir
          const arr = Object.values(data);
          // Sadece giriş ve çıkış işlemlerini göster
          setLogs(arr.filter((item: any) => item.type === 'GIRIS' || item.type === 'CIKIS'));
        } else {
          setLogs([]);
        }
      } catch (e) {
        setLogs([]);
      }
      setLoading(false);
    };
    fetchLogs();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Geçmiş İşlemler</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#00c3ff" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.date}>{item.time ? item.time.substring(0, 10) : ''}</Text>
              <Text style={styles.info}>Tür: {item.type}</Text>
              <Text style={styles.info}>PIN: {item.pin}</Text>
              {item.duration && <Text style={styles.info}>Süre: {item.duration} dk</Text>}
              {item.price && <Text style={styles.info}>Ücret: {item.price} TL</Text>}
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