'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, Check, Edit, Save, X } from 'lucide-react';
import { CompanyProfile } from '../../types/company-profile';
import { api } from '@/trpc/react';

// Define the shape of the form data, similar to the tRPC schema but allowing undefined/null during editing
type CompanyProfileFormData = Omit<Partial<CompanyProfile>, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & {
    id?: string;
    isDefault?: boolean; // Ensure this is optional boolean
};

const initialFormData: CompanyProfileFormData = {
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
};

export function CompanyProfileContainer() {
  // State for form management
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [formData, setFormData] = useState<CompanyProfileFormData>(initialFormData);

  // tRPC Utilities
  const utils = api.useUtils();

  // tRPC Query for listing profiles
  const { data: profiles = [], isLoading: isLoadingProfiles, error: listError } = api.companyProfile.list.useQuery(
    undefined, // No input needed for list
    {
      // Optional: configure refetch behavior, stale time, etc.
      refetchOnWindowFocus: false, 
    }
  );

   // Handle query error
  useEffect(() => {
    if (listError) {
      toast.error(`Failed to load company profiles: ${listError.message}`);
      console.error('Error loading company profiles:', listError);
    }
  }, [listError]);

  // tRPC Mutation for creating a profile
  const createProfileMutation = api.companyProfile.create.useMutation({
    onSuccess: (newProfile) => {
      toast.success('Company profile created');
      utils.companyProfile.list.invalidate(); // Invalidate list query to refetch
      setIsCreatingNew(false);
      setFormData(initialFormData);
    },
    onError: (error) => {
      toast.error(`Failed to create profile: ${error.message}`);
      console.error('Error creating profile:', error);
    },
  });

  // tRPC Mutation for updating a profile
  const updateProfileMutation = api.companyProfile.update.useMutation({
    onSuccess: (updatedProfile) => {
      toast.success('Company profile updated');
      utils.companyProfile.list.invalidate();
      setEditingProfileId(null);
      setFormData(initialFormData);
    },
    onError: (error) => {
      toast.error(`Failed to update profile: ${error.message}`);
      console.error('Error updating profile:', error);
    },
  });

  // tRPC Mutation for deleting a profile
  const deleteProfileMutation = api.companyProfile.delete.useMutation({
    onSuccess: () => {
      toast.success('Company profile deleted');
      utils.companyProfile.list.invalidate();
    },
    onError: (error) => {
      toast.error(`Failed to delete profile: ${error.message}`);
      console.error('Error deleting profile:', error);
    },
  });

  // tRPC Mutation for setting default profile
  const setDefaultProfileMutation = api.companyProfile.setDefault.useMutation({
    onSuccess: () => {
      toast.success('Default profile updated');
      utils.companyProfile.list.invalidate();
    },
    onError: (error) => {
      toast.error(`Failed to set default profile: ${error.message}`);
      console.error('Error setting default profile:', error);
    },
  });

  // Set a profile as default
  const handleSetDefaultProfile = (profileId: string) => {
    if (setDefaultProfileMutation.isLoading) return; // Prevent double clicks
    setDefaultProfileMutation.mutate({ id: profileId });
  };

  // Delete a profile
  const handleDeleteProfile = (profileId: string) => {
    if (deleteProfileMutation.isLoading) return;
    if (!confirm('Are you sure you want to delete this company profile?')) {
      return;
    }
    deleteProfileMutation.mutate({ id: profileId });
  };

  // Start editing a profile
  const startEditing = (profile: CompanyProfile) => {
     if (profile.id) {
        setEditingProfileId(profile.id);
        // Ensure all fields from profile are included, providing defaults for potential nulls if needed
        // The CompanyProfile type and schema should align; nulls might need handling
        const profileDataForForm: CompanyProfileFormData = {
            businessName: profile.businessName || '',
            email: profile.email || '',
            phone: profile.phone || '',
            website: profile.website || '',
            taxRegistration: profile.taxRegistration || '',
            registrationNumber: profile.registrationNumber || '',
            industryType: profile.industryType || '',
            streetAddress: profile.streetAddress || '',
            city: profile.city || '',
            region: profile.region || '',
            postalCode: profile.postalCode || '',
            country: profile.country || '',
            logoUrl: profile.logoUrl || '',
            brandColor: profile.brandColor || '',
            isDefault: profile.isDefault ?? false, // Handle potential null isDefault
            id: profile.id, // include id for update reference
        };
        setFormData(profileDataForForm);
        setIsCreatingNew(false);
    }
  };

  // Start creating a new profile
  const startCreatingProfile = () => {
    setIsCreatingNew(true);
    setEditingProfileId(null);
    setFormData({ ...initialFormData, isDefault: profiles.length === 0 });
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
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

    // Prepare data for mutation (remove potential temporary ID if creating)
    const { id, ...dataToSave } = formData;

    if (isCreatingNew) {
       if (createProfileMutation.isLoading) return;
       createProfileMutation.mutate(dataToSave as any); // Need to assert type correctly based on router input
    } else if (editingProfileId) {
       if (updateProfileMutation.isLoading) return;
       updateProfileMutation.mutate({ ...dataToSave, id: editingProfileId });
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsCreatingNew(false);
    setEditingProfileId(null);
    setFormData(initialFormData);
  };

  const isMutating = createProfileMutation.isLoading || updateProfileMutation.isLoading;

  // Render profile form
  const renderProfileForm = () => {
    return (
      <form onSubmit={saveProfile} className="bg-white p-6 rounded-lg shadow border border-gray-200">
       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Information */} 
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-gray-800">Business Information</h4>
            
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
                disabled={isMutating}
              />
            </div>
            
            <div>
              <label htmlFor="industryType" className="block text-sm font-medium text-gray-700">
                Industry Type
              </label>
              <input
                type="text"
                id="industryType"
                name="industryType"
                value={formData.industryType || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                disabled={isMutating}
              />
            </div>
            
            <div>
              <label htmlFor="taxRegistration" className="block text-sm font-medium text-gray-700">
                Tax Registration Number
              </label>
              <input
                type="text"
                id="taxRegistration"
                name="taxRegistration"
                value={formData.taxRegistration || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                 disabled={isMutating}
             />
            </div>
            
            <div>
              <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
                Registration Number
              </label>
              <input
                type="text"
                id="registrationNumber"
                name="registrationNumber"
                value={formData.registrationNumber || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                 disabled={isMutating}
             />
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-gray-800">Contact Information</h4>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                 disabled={isMutating}
             />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                 disabled={isMutating}
             />
            </div>
            
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="https://example.com"
                 disabled={isMutating}
             />
            </div>
          </div>
        </div>
        
        {/* Address Information */}
        <div className="mt-8">
          <h4 className="font-semibold text-lg text-gray-800 mb-4">Address</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700">
                Street Address
              </label>
              <input
                type="text"
                id="streetAddress"
                name="streetAddress"
                value={formData.streetAddress || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                 disabled={isMutating}
             />
            </div>
            
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                 disabled={isMutating}
             />
            </div>
            
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                Region/State
              </label>
              <input
                type="text"
                id="region"
                name="region"
                value={formData.region || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                 disabled={isMutating}
             />
            </div>
            
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                 disabled={isMutating}
             />
            </div>
            
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                 disabled={isMutating}
             />
            </div>
          </div>
        </div>
        
        {/* Branding */}
        <div className="mt-8">
          <h4 className="font-semibold text-lg text-gray-800 mb-4">Branding</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">
                Logo URL
              </label>
              <input
                type="url"
                id="logoUrl"
                name="logoUrl"
                value={formData.logoUrl || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="https://example.com/logo.png"
                 disabled={isMutating}
             />
            </div>
            
            <div>
              <label htmlFor="brandColor" className="block text-sm font-medium text-gray-700">
                Brand Color
              </label>
              <input
                type="text"
                id="brandColor"
                name="brandColor"
                value={formData.brandColor || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="#000000"
                 disabled={isMutating}
             />
            </div>
          </div>
        </div>
        
        {/* Default Profile */}
        <div className="mt-8">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault || false}
              onChange={handleInputChange} // Uses the generic handler now
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              disabled={isMutating}
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
        <div className="mt-8 flex justify-end space-x-3 border-t pt-6">
          <button
            type="button"
            onClick={cancelEditing}
            disabled={isMutating}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isMutating || (!formData.businessName)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <Save className="mr-2 h-4 w-4" />
            {isMutating ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    );
  };

  // Render profile list
  const renderProfileList = () => {
    if (isLoadingProfiles) {
      return <div className="text-center py-4 text-gray-500">Loading company profiles...</div>;
    }

    if (profiles.length === 0 && !isCreatingNew) {
      return (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
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
    // Don't render list if actively editing/creating
    if (isCreatingNew || editingProfileId) {
      return null;
    }

    return (
      <div className="space-y-4">
        {profiles.map(profile => (
          <div key={profile.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-150">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
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
                    <div className="flex items-center truncate">
                      <span className="font-medium mr-1 shrink-0">Email:</span> 
                      <span className="truncate">{profile.email}</span>
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
                    <div className="flex items-center col-span-1 md:col-span-2">
                      <span className="font-medium mr-1 shrink-0">Address:</span>
                      <span className="truncate">{[ 
                        profile.streetAddress,
                        profile.city,
                        profile.region,
                        profile.postalCode,
                        profile.country
                      ].filter(Boolean).join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2 flex-shrink-0">
                {!profile.isDefault && (
                  <button
                    onClick={() => handleSetDefaultProfile(profile.id!)}
                    disabled={setDefaultProfileMutation.isLoading}
                    className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    title="Set as default"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
                
                <button
                  onClick={() => startEditing(profile)}
                  disabled={isMutating} // Disable edit if another mutation is in progress
                  className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  title="Edit profile"
                >
                  <Edit className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => handleDeleteProfile(profile.id!)}
                  disabled={deleteProfileMutation.isLoading}
                  className="inline-flex items-center p-1.5 border border-red-300 shadow-sm text-xs rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center pb-4 border-b">
        <h2 className="text-2xl font-bold text-gray-900">Company Profiles</h2>
        
        {/* Show Add button only if not loading, not editing, and not creating */} 
        {!isLoadingProfiles && !isCreatingNew && !editingProfileId && (
          <button
            onClick={startCreatingProfile}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Profile
          </button>
        )}
      </div>
      
      <p className="text-gray-600">
        Manage your company profiles. The default profile is used automatically for new invoices.
      </p>
      
      {/* Conditionally render form or list */} 
      {(isCreatingNew || editingProfileId) ? renderProfileForm() : renderProfileList()}
      
    </div>
  );
}
