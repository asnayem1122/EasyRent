// Mock data for seamless offline & static demo hosting (GitHub Pages)

export const MOCK_USERS = [
  {
    user_id: 1,
    name: 'System Admin',
    email: 'admin@easyrent.com',
    phone: '+8801700000000',
    role: 'admin',
    created_at: '2026-01-15T10:00:00Z'
  },
  {
    user_id: 2,
    name: 'Rahim Chowdhury (Owner)',
    email: 'owner@easyrent.com',
    phone: '+8801711223344',
    role: 'owner',
    created_at: '2026-02-01T12:30:00Z'
  },
  {
    user_id: 3,
    name: 'Tanvir Hossain (Tenant)',
    email: 'tenant@easyrent.com',
    phone: '+8801899887766',
    role: 'tenant',
    created_at: '2026-03-10T14:15:00Z'
  }
];

export const MOCK_PROPERTIES = [
  {
    property_id: 1,
    owner_id: 2,
    owner_name: 'Rahim Chowdhury',
    owner_email: 'owner@easyrent.com',
    owner_phone: '+8801711223344',
    title: 'Luxury 3-Bedroom Apartment in Gulshan 2',
    description: 'Spacious and elegantly designed 3-bedroom luxury flat featuring South-facing balcony, generator backup, 24/7 CCTV security, reserved parking, and modern fitting kitchen. Located near Diplomatic Zone, schools, and shopping centers.',
    rent: 65000,
    location: 'Gulshan 2, Dhaka',
    rooms: 3,
    bathrooms: 3,
    property_type: 'Flat',
    status: 'Available',
    approval_status: 'Approved',
    contact_info: 'Call owner directly between 10 AM and 8 PM for site visits.',
    main_image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    images: [
      { image_id: 101, image_path: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80' },
      { image_id: 102, image_path: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80' },
      { image_id: 103, image_path: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80' }
    ]
  },
  {
    property_id: 2,
    owner_id: 2,
    owner_name: 'Rahim Chowdhury',
    owner_email: 'owner@easyrent.com',
    owner_phone: '+8801711223344',
    title: 'Modern 2-BD Flat near Dhanmondi Lake',
    description: 'Cozy and well-lit 2-bedroom flat situated in prime Dhanmondi Road 8A. Enjoy peaceful lake views, open kitchen design, elevator access, and nearby universities.',
    rent: 32000,
    location: 'Dhanmondi, Dhaka',
    rooms: 2,
    bathrooms: 2,
    property_type: 'Flat',
    status: 'Available',
    approval_status: 'Approved',
    contact_info: 'Email owner or send inquiry via platform to book appointment.',
    main_image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    images: [
      { image_id: 201, image_path: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80' },
      { image_id: 202, image_path: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80' }
    ]
  },
  {
    property_id: 3,
    owner_id: 2,
    owner_name: 'Rahim Chowdhury',
    owner_email: 'owner@easyrent.com',
    owner_phone: '+8801711223344',
    title: 'Duplex Family Villa in Banani DOHS',
    description: 'Exclusive 4-bedroom duplex villa in secure Banani DOHS community. Features private rooftop terrace, garden space, servant room, full power backup, and garage for 2 cars.',
    rent: 120000,
    location: 'Banani DOHS, Dhaka',
    rooms: 4,
    bathrooms: 4,
    property_type: 'House',
    status: 'Available',
    approval_status: 'Approved',
    contact_info: 'Inquire online or reach out via WhatsApp.',
    main_image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    images: [
      { image_id: 301, image_path: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80' },
      { image_id: 302, image_path: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' }
    ]
  },
  {
    property_id: 4,
    owner_id: 2,
    owner_name: 'Rahim Chowdhury',
    owner_email: 'owner@easyrent.com',
    owner_phone: '+8801711223344',
    title: 'Affordable Bachelor / Student Flat in Uttara Sector 7',
    description: 'Clean 1-bedroom self-contained flat suitable for students or job professionals. Walking distance to Metro Station, market, and main road.',
    rent: 16500,
    location: 'Uttara, Dhaka',
    rooms: 1,
    bathrooms: 1,
    property_type: 'Flat',
    status: 'Available',
    approval_status: 'Approved',
    contact_info: 'Call owner for immediate viewing.',
    main_image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    images: [
      { image_id: 401, image_path: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80' }
    ]
  },
  {
    property_id: 5,
    owner_id: 2,
    owner_name: 'Rahim Chowdhury',
    owner_email: 'owner@easyrent.com',
    owner_phone: '+8801711223344',
    title: 'Executive Sea-View Flat in Agrabad, Chittagong',
    description: '3-bedroom executive apartment located in commercial heart of Chittagong. High floor with sea breeze, marble flooring, and security.',
    rent: 45000,
    location: 'Agrabad, Chittagong',
    rooms: 3,
    bathrooms: 3,
    property_type: 'Flat',
    status: 'Available',
    approval_status: 'Approved',
    contact_info: 'Contact property manager anytime.',
    main_image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    images: [
      { image_id: 501, image_path: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80' }
    ]
  }
];

export const MOCK_INQUIRIES = [
  {
    inquiry_id: 1,
    property_id: 1,
    property_title: 'Luxury 3-Bedroom Apartment in Gulshan 2',
    tenant_name: 'Tanvir Hossain',
    tenant_email: 'tenant@easyrent.com',
    tenant_phone: '+8801899887766',
    message: 'Hello! I am very interested in viewing this property this coming Saturday. Please let me know your preferred time slot.',
    created_at: '2026-06-10T14:30:00Z'
  },
  {
    inquiry_id: 2,
    property_id: 2,
    property_title: 'Modern 2-BD Flat near Dhanmondi Lake',
    tenant_name: 'Tanvir Hossain',
    tenant_email: 'tenant@easyrent.com',
    tenant_phone: '+8801899887766',
    message: 'Is the rent negotiable for long-term lease (2 years)? Thank you!',
    created_at: '2026-06-12T09:15:00Z'
  }
];

export const MOCK_STATS = {
  totalUsers: 148,
  totalProperties: 42,
  pendingApprovals: 3,
  totalInquiries: 89
};
