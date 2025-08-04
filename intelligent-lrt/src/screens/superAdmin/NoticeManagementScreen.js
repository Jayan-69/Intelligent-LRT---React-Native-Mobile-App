import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
  FlatList
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { getServerBaseUrl } from '../../config/apiConfig';

const NoticeManagementScreen = () => {
  const { colors } = useTheme();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [error, setError] = useState(null);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('General');

  const noticeTypes = [
    'General',
    'Special',
    'Delay',
    'Cancellation',
    'Maintenance',
    'Emergency'
  ];

  const fetchNotices = useCallback(async () => {
    try {
      setError(null);
      const baseUrl = await getServerBaseUrl();
      const response = await fetch(`${baseUrl}/api/notices`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setNotices(data);
    } catch (error) {
      console.error('Error fetching notices:', error);
      setError('Failed to fetch notices. Please check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotices();
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setType('General');
    setEditingNotice(null);
  };

  const openEditModal = (notice) => {
    setEditingNotice(notice);
    setTitle(notice.title);
    setContent(notice.content);
    setType(notice.type);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!title || !content) {
      Alert.alert('Error', 'Please fill in both title and content');
      return;
    }

    try {
      const baseUrl = await getServerBaseUrl();
      const noticeData = {
        title,
        content,
        type
      };

      let response;
      if (editingNotice) {
        // Update existing notice
        response = await fetch(`${baseUrl}/api/notices/${editingNotice._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(noticeData),
        });
      } else {
        // Create new notice
        response = await fetch(`${baseUrl}/api/notices`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(noticeData),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to save notice. Please try again.';
        
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // If we can't parse the error, use the raw text
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      Alert.alert(
        'Success',
        editingNotice ? 'Notice updated successfully!' : 'Notice created successfully!'
      );

      setModalVisible(false);
      resetForm();
      fetchNotices();
    } catch (error) {
      console.error('Error saving notice:', error);
      Alert.alert('Error', error.message || 'Failed to save notice. Please try again.');
    }
  };

  const handleDelete = async (noticeId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this notice?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const baseUrl = await getServerBaseUrl();
              const response = await fetch(`${baseUrl}/api/notices/${noticeId}`, {
                method: 'DELETE',
              });

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              Alert.alert('Success', 'Notice deleted successfully!');
              fetchNotices();
            } catch (error) {
              console.error('Error deleting notice:', error);
              Alert.alert('Error', 'Failed to delete notice. Please try again.');
            }
          },
        },
      ]
    );
  };

  const getNoticeIcon = (type) => {
    switch (type) {
      case 'Special':
        return 'megaphone';
      case 'Delay':
        return 'time';
      case 'Cancellation':
        return 'close-circle';
      case 'Maintenance':
        return 'construct';
      case 'Emergency':
        return 'warning';
      default:
        return 'information-circle';
    }
  };

  const getNoticeColor = (type) => {
    switch (type) {
      case 'Special':
        return '#2196F3';
      case 'Delay':
        return '#FF9800';
      case 'Cancellation':
        return '#F44336';
      case 'Maintenance':
        return '#9C27B0';
      case 'Emergency':
        return '#FF5722';
      default:
        return '#757575';
    }
  };

  const renderNoticeItem = ({ item }) => (
    <View style={[styles.noticeItem, { backgroundColor: colors.surface }]}>
      <View style={styles.noticeHeader}>
        <View style={styles.noticeIconContainer}>
          <Ionicons 
            name={getNoticeIcon(item.type)} 
            size={24} 
            color={getNoticeColor(item.type)} 
          />
        </View>
        <View style={styles.noticeContent}>
          <Text style={[styles.noticeTitle, { color: colors.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.noticeText, { color: colors.text }]}>
            {item.content}
          </Text>
          <View style={styles.noticeMeta}>
            <Text style={[styles.noticeType, { color: getNoticeColor(item.type) }]}>
              {item.type}
            </Text>
            <Text style={[styles.noticeDate, { color: colors.placeholder }]}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={() => openEditModal(item)}
        >
          <Ionicons name="pencil" size={16} color="white" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#F44336' }]}
          onPress={() => handleDelete(item._id)}
        >
          <Ionicons name="trash" size={16} color="white" />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading notices...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Notice Management
        </Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => {
            resetForm();
            setModalVisible(true);
          }}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>
            {notices.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>
            Total Notices
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statNumber, { color: '#FF9800' }]}>
            {notices.filter(n => n.type === 'Delay').length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>
            Delays
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statNumber, { color: '#F44336' }]}>
            {notices.filter(n => n.type === 'Emergency').length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>
            Emergencies
          </Text>
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={notices}
        renderItem={renderNoticeItem}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="megaphone" size={48} color={colors.placeholder} />
            <Text style={[styles.emptyText, { color: colors.placeholder }]}>
              No notices created yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.placeholder }]}>
              Tap the + button to create your first notice
            </Text>
          </View>
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editingNotice ? 'Edit Notice' : 'Create New Notice'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Notice Type</Text>
              <View style={[styles.pickerContainer, { 
                backgroundColor: colors.background,
                borderColor: colors.border
              }]}>
                <Picker
                  selectedValue={type}
                  onValueChange={setType}
                  style={[styles.picker, { color: colors.text }]}
                >
                  {noticeTypes.map((noticeType) => (
                    <Picker.Item key={noticeType} label={noticeType} value={noticeType} />
                  ))}
                </Picker>
              </View>

              <Text style={[styles.inputLabel, { color: colors.text }]}>Title *</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter notice title"
                placeholderTextColor={colors.placeholder}
              />

              <Text style={[styles.inputLabel, { color: colors.text }]}>Content *</Text>
              <TextInput
                style={[styles.textArea, { 
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                value={content}
                onChangeText={setContent}
                placeholder="Enter notice content"
                placeholderTextColor={colors.placeholder}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#757575' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleSave}
              >
                <Text style={styles.modalButtonText}>
                  {editingNotice ? 'Update' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 8,
    borderRadius: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    color: '#c62828',
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
  noticeItem: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  noticeHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  noticeIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noticeText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  noticeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noticeType: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  noticeDate: {
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  formContainer: {
    maxHeight: 400,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 120,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  picker: {
    height: 50,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NoticeManagementScreen;
