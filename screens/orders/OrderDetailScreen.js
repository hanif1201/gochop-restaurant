// src/screens/orders/OrderDetailScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getOrder, updateOrderStatus } from '../../services/orderService';
import { useTheme } from '../../context/ThemeContext';
import { useAlert } from '../../context/AlertContext';
import { ORDER_STATUSES } from '../../config';
import Header from '../../components/common/Header';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import OrderStatusStepper from '../../components/orders/OrderStatusStepper';

const OrderDetailScreen = ({ navigation, route }) => {
  const { orderId } = route.params;
  const { theme } = useTheme();
  const { showAlert } = useAlert();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  
  const fetchOrderDetails = async () => {
    try {
      const response = await getOrder(orderId);
      setOrder(response.data);
      setLoading(false);
    } catch (error) {
      console.log('Error fetching order details:', error);
      showAlert('error', 'Failed to load order details');
      setLoading(false);
      navigation.goBack();
    }
  };
  
  const handleStatusChange = async () => {
    if (!selectedStatus) return;
    
    setStatusLoading(true);
    setShowStatusModal(false);
    
    try {
      const response = await updateOrderStatus(orderId, selectedStatus);
      setOrder(response.data);
      showAlert('success', `Order status updated to ${selectedStatus}`);
    } catch (error) {
      console.log('Error updating order status:', error);
      showAlert('error', 'Failed to update order status');
    } finally {
      setStatusLoading(false);
    }
  };
  
  const openStatusModal = (status) => {
    setSelectedStatus(status);
    setShowStatusModal(true);
  };
  
  const getNextStatus = () => {
    const statusFlow = [
      ORDER_STATUSES.PENDING,
      ORDER_STATUSES.ACCEPTED,
      ORDER_STATUSES.PREPARING,
      ORDER_STATUSES.READY_FOR_PICKUP
    ];
    
    const currentIndex = statusFlow.indexOf(order.status);
    
    if (currentIndex === -1 || currentIndex === statusFlow.length - 1) {
      return null;
    }
    
    return statusFlow[currentIndex + 1];
  };
  
  const getStatusBadgeType = (status) => {
    switch (status) {
      case ORDER_STATUSES.PENDING:
        return 'warning';
      case ORDER_STATUSES.ACCEPTED:
      case ORDER_STATUSES.PREPARING:
      case ORDER_STATUSES.READY_FOR_PICKUP:
      case ORDER_STATUSES.ASSIGNED_TO_RIDER:
      case ORDER_STATUSES.PICKED_UP:
      case ORDER_STATUSES.ON_THE_WAY:
        return 'info';
      case ORDER_STATUSES.DELIVERED:
        return 'success';
      case ORDER_STATUSES.CANCELLED:
        return 'error';
      default:
        return 'default';
    }
  };
  
  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);
  
  if (loading) {
    return <Loader fullScreen message="Loading order details..." />;
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };
  
  const nextStatus = getNextStatus();
  const canCancel = order.status === ORDER_STATUSES.PENDING;
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header 
        title={`Order #${order._id.substring(order._id.length - 6)}`} 
        showBackButton 
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Status Card */}
        <Card style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Order Status
              </Text>
              <Badge
                text={order.status.toUpperCase().replace('_', ' ')}
                type={getStatusBadgeType(order.status)}
                style={styles.statusBadge}
              />
            </View>
            
            <Text style={[styles.orderDate, { color: theme.colors.gray }]}>
              {formatDate(order.createdAt)}
            </Text>
          </View>
          
          <OrderStatusStepper 
            currentStatus={order.status}
            statusHistory={order.statusHistory}
          />
          
          {/* Status Update Buttons */}
          <View style={styles.statusActions}>
            {nextStatus && (
              <Button
                title={`Mark as ${nextStatus.toUpperCase().replace('_', ' ')}`}
                onPress={() => openStatusModal(nextStatus)}
                loading={statusLoading}
                style={styles.statusButton}
              />
            )}
            
            {canCancel && (
              <Button
                title="Cancel Order"
                type="danger"
                onPress={() => openStatusModal(ORDER_STATUSES.CANCELLED)}
                loading={statusLoading}
                style={styles.statusButton}
              />
            )}
          </View>
        </Card>
        
        {/* Customer Info */}
        <Card>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Customer Information
          </Text>
          
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: theme.colors.gray }]}>Name:</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {order.user.name}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: theme.colors.gray }]}>Email:</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {order.user.email}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: theme.colors.gray }]}>Phone:</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {order.user.phone}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={[styles.subsectionTitle, { color: theme.colors.text }]}>
            Delivery Address
          </Text>
          
          <View style={styles.addressContainer}>
            <Ionicons name="location-outline" size={20} color={theme.colors.gray} style={styles.addressIcon} />
            <Text style={[styles.addressText, { color: theme.colors.text }]}>
              {order.deliveryAddress.address}
            </Text>
          </View>
          
          {order.deliveryAddress.instructions && (
            <View style={styles.instructionsContainer}>
              <Ionicons name="information-circle-outline" size={20} color={theme.colors.gray} style={styles.addressIcon} />
              <Text style={[styles.instructionsText, { color: theme.colors.text }]}>
                {order.deliveryAddress.instructions}
              </Text>
            </View>
          )}
        </Card>
        
        {/* Order Items */}
        <Card>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Order Items
          </Text>
          
          {order.items.map((item, index) => (
            <View 
              key={index} 
              style={[
                styles.orderItem,
                index < order.items.length - 1 && { 
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.border,
                },
              ]}
            >
              <View style={styles.itemDetails}>
                <Text style={[styles.itemName, { color: theme.colors.text }]}>
                  {item.name} x {item.quantity}
                </Text>
                
                {item.customizations && item.customizations.length > 0 && (
                  <View style={styles.customizations}>
                    {item.customizations.map((customization, custIndex) => (
                      <Text key={custIndex} style={[styles.customizationText, { color: theme.colors.gray }]}>
                        {customization.name}: {customization.options.map(opt => opt.name).join(', ')}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
              
              <Text style={[styles.itemPrice, { color: theme.colors.text }]}>
                ${(item.subtotal).toFixed(2)}
              </Text>
            </View>
          ))}
          
          <View style={styles.orderSummary}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: theme.colors.gray }]}>Subtotal</Text>
              <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                ${order.subtotal.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: theme.colors.gray }]}>Tax</Text>
              <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                ${order.tax.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: theme.colors.gray }]}>Delivery Fee</Text>
              <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                ${order.deliveryFee.toFixed(2)}
              </Text>
            </View>
            
            {order.discount > 0 && (
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryLabel, { color: theme.colors.gray }]}>Discount</Text>
                <Text style={[styles.summaryValue, { color: theme.colors.success }]}>
                  -${order.discount.toFixed(2)}
                </Text>
              </View>
            )}
            
            <View style={[styles.summaryItem, styles.totalItem]}>
              <Text style={[styles.totalLabel, { color: theme.colors.text }]}>Total</Text>
              <Text style={[styles.totalValue, { color: theme.colors.primary }]}>
                ${order.total.toFixed(2)}
              </Text>
            </View>
          </View>
          
          <View style={styles.paymentInfo}>
            <View style={styles.paymentItem}>
              <Text style={[styles.paymentLabel, { color: theme.colors.gray }]}>Payment Method:</Text>
              <Badge
                text={order.paymentMethod.toUpperCase()}
                type="info"
                size="small"
              />
            </View>
            
            <View style={styles.paymentItem}>
              <Text style={[styles.paymentLabel, { color: theme.colors.gray }]}>Payment Status:</Text>
              <Badge
                text={order.paymentStatus.toUpperCase()}
                type={order.paymentStatus === 'completed' ? 'success' : 'warning'}
                size="small"
              />
            </View>
          </View>
        </Card>
      </ScrollView>
      
      {/* Status Change Confirmation Modal */}
      <Modal
        visible={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Update Order Status"
      >
        <Text style={[styles.modalText, { color: theme.colors.text }]}>
          Are you sure you want to change the status to
          {' '}{selectedStatus?.toUpperCase().replace('_', ' ')}?
        </Text>
        
        {selectedStatus === ORDER_STATUSES.CANCELLED && (
          <Text style={[styles.modalWarning, { color: theme.colors.error }]}>
            Warning: Cancelling an order cannot be undone.
          </Text>
        )}
        
        <View style={styles.modalButtons}>
          <Button
            title="Cancel"
            type="secondary"
            onPress={() => setShowStatusModal(false)}
            style={styles.modalButton}
          />
          <Button
            title="Confirm"
            type={selectedStatus === ORDER_STATUSES.CANCELLED ? 'danger' : 'primary'}
            onPress={handleStatusChange}
            style={styles.modalButton}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  statusCard: {
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
  },
  orderDate: {
    fontSize: 14,
  },
  statusActions: {
    marginTop: 16,
  },
  statusButton: {
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 80,
    fontSize: 14,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 16,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  addressIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  instructionsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  instructionsText: {
    flex: 1,
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  itemDetails: {
    flex: 1,
    marginRight: 16,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  customizations: {
    marginTop: 4,
  },
  customizationText: {
    fontSize: 12,
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  orderSummary: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
  },
  totalItem: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentInfo: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalWarning: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default OrderDetailScreen;