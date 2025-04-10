'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, Check, Edit, Save, X } from 'lucide-react';
import { CompanyProfile } from '../../types/company-profile';

export function CompanyProfileContainer() {
  const [profiles, setProfiles] = useState<CompanyProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [formData, setFormData] = useState<Partial<CompanyProfile>>({
    businessName: '',
    email: '',
    phone: '',
    website: '',
    taxRegistration: '',
    registrationNumber: '',
    industryType: '',
    streetAddress: '',
    city: '',
    region: '',
    postalCode: '',
    country: '',
    logoUrl: '',
    brandColor: '',
    isDefault: false,
  });

  // Load company profiles
  const loadProfiles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user/company-profile');
      
      if (!response.ok) {
        throw new Error('Failed to load company profiles');
      }
      
      const data = await response.json();
      setProfiles(data.companyProfiles || []);
    } catch (error) {
      console.error('Error loading company profiles:', error);
      toast.error('Failed to load company profiles');
    } finally {
      setIsLoading(false);
    }
  };

  // Load profiles on component mount
  useEffect(() => {
    loadProfiles();
  }, []);

  // Set a profile as default
  const setDefaultProfile = async (profileId: string) => {
    try {
      const response = await fetch(`/api/user/company-profile/${profileId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isDefault: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to set default profile');
      }

      toast.success('Default profile updated');
      loadProfiles(); // Reload profiles to reflect changes
    } catch (error) {
      console.error('Error setting default profile:', error);
      toast.error('Failed to set default profile');
    }
  };

  // Delete a profile
  const deleteProfile = async (profileId: string) => {
    if (!confirm('Are you sure you want to delete this company profile?')) {
      return;
    }

    try {
      const response = await fetch(`/api/user/company-profile/${profileId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete profile');
      }

      toast.success('Company profile deleted');
      loadProfiles(); // Reload profiles to reflect changes
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete profile');
    }
  };

  // Start editing a profile
  const startEditing = (profile: CompanyProfile) => {
    if (profile.id) {
      setEditingProfile(profile.id);
      setFormData({ ...profile });
      setIsCreatingNew(false);
    }
  };

  // Start creating a new profile
  const startCreatingProfile = () => {
    setIsCreatingNew(true);
    setEditingProfile(null);
    setFormData({
      businessName: '',
      email: '',
      phone: '',
      website: '',
      taxRegistration: '',
      registrationNumber: '',
      industryType: '',
      streetAddress: '',
      city: '',
      region: '',
      postalCode: '',
      country: '',
      logoUrl: '',
      brandColor: '',
      isDefault: profiles.length === 0, // Make default if it's the first profile
    });
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Save a profile (create or update)
  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.businessName) {
      toast.error('Business name is required');
      return;
    }

    try {
      let response;
      
      if (isCreatingNew) {
        // Create new profile
        response = await fetch('/api/user/company-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else if (editingProfile) {
        // Update existing profile
        response = await fetch(`/api/user/company-profile/${editingProfile}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }

      if (!response || !response.ok) {
        const errorData = await response?.json();
        throw new Error(errorData?.error || 'Failed to save profile');
      }

      toast.success(isCreatingNew ? 'Company profile created' : 'Company profile updated');
      
      // Reset form state
      setIsCreatingNew(false);
      setEditingProfile(null);
      
      // Reload profiles
      loadProfiles();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save profile');
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsCreatingNew(false);
    setEditingProfile(null);
    setFormData({
      businessName: '',
      email: '',
      phone: '',
      website: '',
      taxRegistration: '',
      registrationNumber: '',
      industryType: '',
      streetAddress: '',
      city: '',
      region: '',
      postalCode: '',
      country: '',
      logoUrl: '',
      brandColor: '',
      isDefault: false,
    });
  };

  // Render profile form
  const renderProfileForm = () => {
    return (
      <form onSubmit={saveProfile} className="">
       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Business Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Business Information</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Industry Type
              </label>
              <input
                type="text"
                name="industryType"
                value={formData.industryType || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tax Registration Number
              </label>
              <input
                type="text"
                name="taxRegistration"
                value={formData.taxRegistration || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Registration Number
              </label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Contact Information</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="https://example.com"
              />
            </div>
          </div>
        </div>
        
        {/* Address Information */}
        <div className="mt-6">
          <h4 className="font-medium text-gray-700 mb-4">Address</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Street Address
              </label>
              <input
                type="text"
                name="streetAddress"
                value={formData.streetAddress || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Region/State
              </label>
              <input
                type="text"
                name="region"
                value={formData.region || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
        
        {/* Branding */}
        <div className="mt-6">
          <h4 className="font-medium text-gray-700 mb-4">Branding</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Logo URL
              </label>
              <input
                type="url"
                name="logoUrl"
                value={formData.logoUrl || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="https://example.com/logo.png"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Brand Color
              </label>
              <input
                type="text"
                name="brandColor"
                value={formData.brandColor || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>
        
        {/* Default Profile */}
        <div className="mt-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault || false}
              onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
              Set as default company profile
            </label>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            The default profile will be used for new invoices and other documents.
          </p>
        </div>
        
        {/* Form Actions */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={cancelEditing}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </button>
          
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Save className="mr-2 h-4 w-4" />
            Save
          </button>
        </div>
      </form>
    );
  };

  // Render profile list
  const renderProfileList = () => {
    if (isLoading) {
      return <div className="text-center py-4">Loading company profiles...</div>;
    }

    if (profiles.length === 0 && !isCreatingNew) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No company profiles found.</p>
          <button
            onClick={startCreatingProfile}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Company Profile
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {profiles.map(profile => (
          <div key={profile.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  {profile.businessName}
                  {profile.isDefault && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Default
                    </span>
                  )}
                </h3>
                
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-500">
                  {profile.email && (
                    <div className="flex items-center">
                      <span className="font-medium mr-1">Email:</span> {profile.email}
                    </div>
                  )}
                  
                  {profile.phone && (
                    <div className="flex items-center">
                      <span className="font-medium mr-1">Phone:</span> {profile.phone}
                    </div>
                  )}
                  
                  {profile.taxRegistration && (
                    <div className="flex items-center">
                      <span className="font-medium mr-1">Tax ID:</span> {profile.taxRegistration}
                    </div>
                  )}
                  
                  {(profile.streetAddress || profile.city || profile.country) && (
                    <div className="flex items-center">
                      <span className="font-medium mr-1">Address:</span>
                      {[
                        profile.streetAddress,
                        profile.city,
                        profile.region,
                        profile.postalCode,
                        profile.country
                      ].filter(Boolean).join(', ')}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                {!profile.isDefault && (
                  <button
                    onClick={() => setDefaultProfile(profile.id!)}
                    className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    title="Set as default"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
                
                <button
                  onClick={() => startEditing(profile)}
                  className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  title="Edit profile"
                >
                  <Edit className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => deleteProfile(profile.id!)}
                  className="inline-flex items-center p-1.5 border border-red-300 shadow-sm text-xs rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  title="Delete profile"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Company Profiles</h2>
        
        {!isCreatingNew && !editingProfile && (
          <button
            onClick={startCreatingProfile}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Profile
          </button>
        )}
      </div>
      
      <p className="text-gray-500">
        Manage your company profiles for invoices and other documents.
      </p>
      
      {(isCreatingNew || editingProfile) && renderProfileForm()}
      
      {renderProfileList()}
    </div>
  );
}
