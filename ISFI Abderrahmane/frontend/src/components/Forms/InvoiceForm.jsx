import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Select from '../Common/Select';
import Button from '../Common/Button';
import { createInvoice } from '@/store/invoicesSlice';
import { showSuccess, showError } from '@/utils/toast';

function InvoiceForm({ onSuccess }) {
  const dispatch = useDispatch();
  const { items: clients } = useSelector((state) => state.clients);

  const [formData, setFormData] = useState({
    clientId: '',
    invoiceNumber: `INV-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    taxRate: 0,
    discountRate: 0,
    notes: '',
  });

  const [lineItems, setLineItems] = useState([
    { description: '', quantity: 1, rate: 0 },
  ]);

  const [errors, setErrors] = useState({});

  const clientOptions = clients.map((client) => ({
    value: client.id.toString(),
    label: client.name,
  }));

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, rate: 0 }]);
  };

  const removeLineItem = (index) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const updateLineItem = (index, field, value) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (formData.taxRate / 100);
  };

  const calculateDiscount = () => {
    return calculateSubtotal() * (formData.discountRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - calculateDiscount();
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.clientId) newErrors.clientId = 'Client is required';
    if (!formData.invoiceNumber) newErrors.invoiceNumber = 'Invoice number is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';

    const hasEmptyItems = lineItems.some(
      (item) => !item.description || item.quantity <= 0 || item.rate <= 0
    );
    if (hasEmptyItems) {
      newErrors.lineItems = 'All line items must have description, quantity, and rate';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const invoiceData = {
        clientId: parseInt(formData.clientId),
        invoiceNumber: formData.invoiceNumber,
        date: formData.date,
        dueDate: formData.dueDate,
        items: lineItems,
        taxRate: parseFloat(formData.taxRate),
        discountRate: parseFloat(formData.discountRate),
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        discount: calculateDiscount(),
        total: calculateTotal(),
        notes: formData.notes,
        status: 'unpaid',
      };

      await dispatch(createInvoice(invoiceData)).unwrap();
      showSuccess('Invoice created successfully');

      if (onSuccess) onSuccess();
    } catch (error) {
      showError('Failed to create invoice');
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Client and Invoice Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Client *"
          value={formData.clientId}
          onChange={(e) => handleChange('clientId', e.target.value)}
          options={clientOptions}
          placeholder="Select a client"
          error={errors.clientId}
        />

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Invoice Number *
          </label>
          <input
            type="text"
            value={formData.invoiceNumber}
            onChange={(e) => handleChange('invoiceNumber', e.target.value)}
            className={`w-full px-4 py-2.5 rounded-lg border bg-background text-foreground ${
              errors.invoiceNumber ? 'border-red-500' : 'border-border'
            } focus:border-primary focus:ring-2 focus:ring-primary/20`}
          />
          {errors.invoiceNumber && (
            <p className="mt-1.5 text-sm text-red-500">{errors.invoiceNumber}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Invoice Date *
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className={`w-full px-4 py-2.5 rounded-lg border bg-background text-foreground ${
              errors.date ? 'border-red-500' : 'border-border'
            } focus:border-primary focus:ring-2 focus:ring-primary/20`}
          />
          {errors.date && <p className="mt-1.5 text-sm text-red-500">{errors.date}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Due Date *
          </label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            className={`w-full px-4 py-2.5 rounded-lg border bg-background text-foreground ${
              errors.dueDate ? 'border-red-500' : 'border-border'
            } focus:border-primary focus:ring-2 focus:ring-primary/20`}
          />
          {errors.dueDate && <p className="mt-1.5 text-sm text-red-500">{errors.dueDate}</p>}
        </div>
      </div>

      {/* Line Items */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-foreground">Line Items *</label>
          <Button type="button" variant="secondary" size="sm" onClick={addLineItem}>
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </div>

        <div className="space-y-3">
          {lineItems.map((item, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                  placeholder="Description"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="w-24">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                  placeholder="Qty"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="w-32">
                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) => updateLineItem(index, 'rate', parseFloat(e.target.value) || 0)}
                  placeholder="Rate"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="w-32 px-4 py-2.5 text-right text-foreground font-medium">
                ${(item.quantity * item.rate).toFixed(2)}
              </div>
              {lineItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLineItem(index)}
                  className="text-red-500 hover:text-red-600 p-2"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.lineItems && <p className="mt-1.5 text-sm text-red-500">{errors.lineItems}</p>}
      </div>

      {/* Tax and Discount */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Tax Rate (%)
          </label>
          <input
            type="number"
            value={formData.taxRate}
            onChange={(e) => handleChange('taxRate', e.target.value)}
            min="0"
            max="100"
            step="0.01"
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Discount Rate (%)
          </label>
          <input
            type="number"
            value={formData.discountRate}
            onChange={(e) => handleChange('discountRate', e.target.value)}
            min="0"
            max="100"
            step="0.01"
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Totals */}
      <div className="bg-muted p-4 rounded-lg space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground">${calculateSubtotal().toFixed(2)}</span>
        </div>
        {formData.taxRate > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax ({formData.taxRate}%)</span>
            <span className="text-foreground">${calculateTax().toFixed(2)}</span>
          </div>
        )}
        {formData.discountRate > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Discount ({formData.discountRate}%)</span>
            <span className="text-foreground">-${calculateDiscount().toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-semibold border-t border-border pt-2">
          <span className="text-foreground">Total</span>
          <span className="text-foreground">${calculateTotal().toFixed(2)}</span>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Notes (optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Additional notes or payment terms..."
          rows={3}
          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <Button type="submit" variant="primary" className="w-full">
        Create Invoice
      </Button>
    </form>
  );
}

export default InvoiceForm;
