import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
  Clipboard,
  Platform,
} from 'react-native';
import { db, ref, push, get } from '../constants/firebaseConfig';
import * as Animatable from 'react-native-animatable';
import ConfettiCannon from 'react-native-confetti-cannon';
import { router } from 'expo-router';

const generatePinCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const QrPage = () => {
  const [lastPin, setLastPin] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [pressedButton, setPressedButton] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [copied, setCopied] = useState(false);

  const handleButtonPress = async (type: 'GIRIS' | 'CIKIS') => {
    setPressedButton(type);
    setTimeout(() => setPressedButton(null), 1000);

    if (type === 'GIRIS') {
      const pin = generatePinCode();
      const now = new Date();

      await push(ref(db, 'logs'), {
        type: 'GIRIS',
        pin,
        time: now.toISOString(),
      });

      setLastPin(pin);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }

    if (type === 'CIKIS') {
      setShowModal(true); // PIN giriş ekranını aç
    }
  };

  const handleConfirmPin = async () => {
    if (!enteredPin) return;

    const snapshot = await get(ref(db, 'logs'));
    if (snapshot.exists()) {
      const logs = snapshot.val();
      const entries = Object.values(logs).filter(
        (log: any) => log.type === 'GIRIS' && log.pin === enteredPin
      );

      if (entries.length > 0) {
        const lastEntry = entries[entries.length - 1] as { time: string };
        const entryTime = new Date(lastEntry.time);
        const now = new Date();
        const diffMs = now.getTime() - entryTime.getTime();
        const diffMins = Math.ceil(diffMs / (1000 * 60));
        const totalPrice = Math.ceil(diffMins / 20) * 20;

        setDuration(diffMins);
        setPrice(totalPrice);

        await push(ref(db, 'logs'), {
          type: 'CIKIS',
          pin: enteredPin,
          time: now.toISOString(),
          duration: diffMins,
          price: totalPrice,
        });

        setShowModal(false);
        setEnteredPin('');
      } else {
        Alert.alert('⚠️ Hatalı PIN', 'Bu PIN koduyla giriş bulunamadı.');
      }
    }
  };

  const handleCopyPin = () => {
    if (lastPin) {
      if (Platform.OS === 'web') {
        navigator.clipboard.writeText(lastPin);
      } else {
        Clipboard.setString(lastPin);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.homeButton} onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.homeButtonText}>🏠</Text>
      </TouchableOpacity>

      {showConfetti && (
        <ConfettiCannon count={100} origin={{ x: 200, y: 0 }} fadeOut={true} />
      )}

      <Text style={styles.title}>🅿️ PIN Kodu Simülasyonu</Text>
      <Text style={styles.desc}>Araç giriş ve çıkış işlemlerinizi başlatın.</Text>

      <View style={styles.buttonRow}>
        <Animatable.View animation={pressedButton === 'GIRIS' ? 'bounceIn' : undefined}>
          <TouchableOpacity style={[styles.bigButton, { backgroundColor: '#007aff' }]} onPress={() => handleButtonPress('GIRIS')}>
            <Text style={styles.bigButtonIcon}>🚗</Text>
            <Text style={styles.bigButtonText}>GİRİŞ YAP</Text>
          </TouchableOpacity>
        </Animatable.View>
        <Animatable.View animation={pressedButton === 'CIKIS' ? 'bounceIn' : undefined}>
          <TouchableOpacity style={[styles.bigButton, { backgroundColor: '#00c853' }]} onPress={() => handleButtonPress('CIKIS')}>
            <Text style={styles.bigButtonIcon}>🏁</Text>
            <Text style={styles.bigButtonText}>ÇIKIŞ YAP</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>

      {lastPin && (
        <Animatable.View animation="fadeIn" style={styles.pinBox}>
          <Text style={styles.pinText}>📌 <Text style={{ color: '#00ff99', fontWeight: 'bold' }}>PIN Kodunuz: {lastPin}</Text></Text>
          <TouchableOpacity style={styles.copyButton} onPress={handleCopyPin}>
            <Text style={styles.copyButtonText}>{copied ? 'Kopyalandı!' : 'Kopyala'}</Text>
          </TouchableOpacity>
          <Text style={styles.infoText}>Lütfen çıkışta bu kodu kullanın.</Text>
        </Animatable.View>
      )}

      {duration !== null && price !== null && (
        <Animatable.View animation="pulse" style={styles.resultBox}>
          <Text style={styles.resultText}>⏱ Süre: {duration} dakika</Text>
          <Text style={styles.resultText}>💰 Ücret: {price} TL</Text>
        </Animatable.View>
      )}

      {/* PIN giriş ekranı */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContentModern}>
            <Text style={styles.modalTitle}>📥 PIN Kodunuzu Girin</Text>
            <TextInput
              placeholder="4 Haneli PIN"
              keyboardType="number-pad"
              style={styles.input}
              value={enteredPin}
              onChangeText={setEnteredPin}
              maxLength={4}
            />
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPin}>
              <Text style={styles.confirmButtonText}>ONAYLA</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.cancelText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  homeButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    backgroundColor: '#222',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    zIndex: 10,
    elevation: 2,
  },
  homeButtonText: {
    color: '#00c3ff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00c3ff',
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 60,
  },
  desc: {
    color: '#bbb',
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  bigButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 28,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  bigButtonIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  bigButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pinBox: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 18,
    marginTop: 25,
    alignItems: 'center',
    width: 320,
    maxWidth: '90%',
    elevation: 2,
  },
  copyButton: {
    backgroundColor: '#00c3ff',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginTop: 10,
    marginBottom: 4,
  },
  copyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  infoText: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 4,
    textAlign: 'center',
  },
  resultBox: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 16,
    marginTop: 18,
    alignItems: 'center',
    width: 260,
    maxWidth: '90%',
    elevation: 2,
  },
  resultText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 4,
    textAlign: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentModern: {
    backgroundColor: '#181818',
    padding: 28,
    borderRadius: 18,
    width: 320,
    maxWidth: '90%',
    alignItems: 'center',
    elevation: 4,
  },
  modalTitle: {
    fontSize: 20,
    color: '#00ffcc',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 8,
    padding: 12,
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 18,
  },
  confirmButton: {
    backgroundColor: '#00c853',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelText: {
    color: '#ff5252',
    marginTop: 5,
    fontSize: 15,
  },
  pinText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 2,
  },
});

export default QrPage;
