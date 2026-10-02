-- Seed Locations
INSERT INTO locations (name, slug, city, description, is_active) VALUES
('Gurudev Chauraha', 'gurudev-chauraha', 'Kanpur', 'Prime location near main market and transportation hubs', true),
('Kakadeo', 'kakadeo', 'Kanpur', 'Well-connected residential area with good amenities', true),
('Vijay Nagar', 'vijay-nagar', 'Kanpur', 'Upscale neighborhood with modern infrastructure', true),
('Vikas Nagar', 'vikas-nagar', 'Kanpur', 'Developing area with excellent connectivity', true),
('Awas Vikas', 'awas-vikas', 'Kanpur', 'Planned residential colony with parks and schools', true),
('Sharda Nagar', 'sharda-nagar', 'Kanpur', 'Peaceful residential area with green surroundings', true),
('Shastri Nagar', 'shastri-nagar', 'Kanpur', 'Well-established neighborhood with all facilities', true),
('Barra', 'barra', 'Kanpur', 'Prime location near industrial area and markets', true),
('Panki', 'panki', 'Kanpur', 'Growing area with good transportation links', true),
('Kidwai Nagar', 'kidwai-nagar', 'Kanpur', 'Central location with excellent amenities', true),
('Swaroop Nagar', 'swaroop-nagar', 'Kanpur', 'Popular residential area with good schools', true),
('Civil Lines', 'civil-lines', 'Kanpur', 'Premium location with colonial heritage', true),
('Arya Nagar', 'arya-nagar', 'Kanpur', 'Well-connected area with commercial centers', true),
('Kidwai Nagar East', 'kidwai-nagar-east', 'Kanpur', 'Extension of Kidwai Nagar with new developments', true),
('Kidwai Nagar West', 'kidwai-nagar-west', 'Kanpur', 'Peaceful residential pocket', true),
('Kalyanpur', 'kalyanpur', 'Kanpur', 'Educational hub with university nearby', true)
ON CONFLICT (slug) DO NOTHING;

-- Seed Agents
INSERT INTO agents (name, slug, role, description, phone, email, experience_years, deals_count, rating, years_active, specializations, areas, is_active) VALUES
('Rajesh Pathak', 'rajesh-pathak', 'Founder & CEO', '14+ years in Kanpur real estate. Ex-banker turned entrepreneur with a passion for making renting fair.', '+91 6398987290', 'pathak424448@gmail.com', 14, 500, 4.9, 14, ARRAY['Property Management', 'Tenant Verification', 'Lease Drafting'], ARRAY['Gurudev Chauraha', 'Kakadeo', 'Vijay Nagar', 'Vikas Nagar'], true),
('Shikha Pathak', 'shikha-pathak', 'Co-Founder & Operations', 'Leads tenant verification, lease management, and the 7-member client support team.', '+91 8765432109', 'shikha@primehomekanpur.com', 12, 350, 4.8, 12, ARRAY['Operations', 'Client Support', 'Documentation'], ARRAY['Awadhpuri', 'Swaroop Nagar', 'Kidwai Nagar'], true),
('Amit Kumar', 'amit-kumar', 'Head of Listings', 'Verifies every property in person before it goes live — maintains our quality benchmark.', '+91 7654321098', 'amit@primehomekanpur.com', 8, 200, 4.7, 8, ARRAY['Property Verification', 'Market Analysis', 'Quality Control'], ARRAY['All Areas'], true),
('Neha Mishra', 'neha-mishra', 'Senior Agent', 'Expert in Vikas Nagar, Kakadeo, and Vijay Nagar markets. 180+ deals closed.', '+91 6543210987', 'neha@primehomekanpur.com', 6, 180, 4.8, 6, ARRAY['Residential Rentals', 'PG Accommodation', 'Commercial'], ARRAY['Vikas Nagar', 'Kakadeo', 'Vijay Nagar'], true),
('Suresh Gupta', 'suresh-gupta', 'Agent', 'Specializes in budget-friendly rentals for students and working professionals.', '+91 5432109876', 'suresh@primehomekanpur.com', 5, 120, 4.6, 5, ARRAY['Student Housing', 'Bachelor Rentals', 'Budget Properties'], ARRAY['Kalyanpur', 'Arya Nagar', 'Sharda Nagar'], true)
ON CONFLICT (slug) DO NOTHING;

-- Seed Amenities
INSERT INTO amenities (name, icon) VALUES
('Parking', 'Car'),
('Power Backup', 'Zap'),
('24x7 Water', 'Droplets'),
('Elevator', 'ArrowUp'),
('High-Speed WiFi', 'Wifi'),
('Balcony', 'Squares'),
('Security', 'Shield'),
('Washing Machine', 'WashingMachine'),
('Modular Kitchen', 'ChefHat'),
('AC', 'Wind'),
('DTH Connection', 'Tv'),
('Gym', 'Dumbbell'),
('Swimming Pool', 'Waves'),
('Club House', 'Building'),
('Children Play Area', 'Baby')
ON CONFLICT (name) DO NOTHING;

-- Seed Properties
INSERT INTO properties (slug, title, description, price, security_deposit, maintenance, property_type, bhk, bathrooms, area_sqft, floor, total_floors, tenant_type, furnishing, status, location_id, address, featured, available_from) VALUES
('spacious-2bhk-apartment', 'Spacious 2BHK Apartment', 'Well-maintained 2BHK apartment in prime location with excellent ventilation and natural light. Close to market and schools.', 18000, 36000, 1500, 'Apartment', 2, 2, 1050, 3, 5, 'Family', 'Semi-Furnished', 'AVAILABLE', (SELECT id FROM locations WHERE slug = 'gurudev-chauraha'), 'Main Road, Gurudev Chauraha, Kanpur', false, '2026-10-01'),
('cozy-studio-flat', 'Cozy Studio Flat', 'Perfect for working professionals. Compact studio with built-in kitchen and modern bathroom. Well-connected to metro.', 12000, 24000, 1000, 'Studio', 1, 1, 450, 2, 4, 'Bachelor', 'Fully Furnished', 'AVAILABLE', (SELECT id FROM locations WHERE slug = 'kakadeo'), 'Sector 4, Kakadeo, Kanpur', false, '2026-10-05'),
('luxurious-3bhk-duplex', 'Luxurious 3BHK Duplex', 'Premium duplex apartment with modern amenities. Spacious rooms, modular kitchen, and excellent view. Ideal for families.', 35000, 70000, 3000, 'Duplex', 3, 3, 1800, 4, 6, 'Family', 'Fully Furnished', 'AVAILABLE', (SELECT id FROM locations WHERE slug = 'vijay-nagar'), 'VIP Road, Vijay Nagar, Kanpur', false, '2026-10-10'),
('modern-2bhk-with-balcony', 'Modern 2BHK with Balcony', 'Newly constructed 2BHK with balcony. Modern fixtures, excellent natural light, and well-ventilated rooms.', 22000, 44000, 2000, 'Apartment', 2, 2, 1200, 5, 8, 'Professional', 'Semi-Furnished', 'AVAILABLE', (SELECT id FROM locations WHERE slug = 'vikas-nagar'), 'Block A, Vikas Nagar, Kanpur', true, '2026-10-01'),
('budget-friendly-1bhk', 'Budget Friendly 1BHK', 'Affordable 1BHK perfect for students and bachelors. Well-maintained with basic amenities.', 8000, 16000, 800, 'Apartment', 1, 1, 550, 2, 3, 'Bachelor', 'Unfurnished', 'AVAILABLE', (SELECT id FROM locations WHERE slug = 'awas-vikas'), 'Sector 2, Awas Vikas, Kanpur', false, '2026-10-03'),
('premium-3bhk-villa', 'Premium 3BHK Villa', 'Luxurious independent villa with garden and parking. Spacious rooms, modern kitchen, and excellent location.', 45000, 90000, 4000, 'Villa', 3, 3, 2200, 1, 2, 'Family', 'Fully Furnished', 'AVAILABLE', (SELECT id FROM locations WHERE slug = 'civil-lines'), 'Civil Lines, Kanpur', false, '2026-10-15'),
('newly-built-2bhk-flat', 'Newly Built 2BHK Flat', 'Brand new 2BHK flat with modern amenities. Excellent construction quality and prime location.', 25000, 50000, 2200, 'Apartment', 2, 2, 1150, 4, 7, 'Family', 'Semi-Furnished', 'AVAILABLE', (SELECT id FROM locations WHERE slug = 'sharda-nagar'), 'Sharda Nagar, Kanpur', false, '2026-10-20'),
('near-metro-1bhk', 'Near Metro 1BHK', 'Convenient 1BHK near metro station. Perfect for working professionals with good connectivity.', 15000, 30000, 1200, 'Apartment', 1, 1, 600, 3, 5, 'Professional', 'Fully Furnished', 'AVAILABLE', (SELECT id FROM locations WHERE slug = 'kidwai-nagar'), 'Kidwai Nagar, Kanpur', false, '2026-10-08'),
('heritage-3bhk-apartment', 'Heritage 3BHK Apartment', 'Beautiful 3BHK in heritage building with high ceilings and classic architecture. Well-maintained.', 30000, 60000, 2500, 'Apartment', 3, 3, 1600, 2, 4, 'Family', 'Semi-Furnished', 'AVAILABLE', (SELECT id FROM locations WHERE slug = 'arya-nagar'), 'Arya Nagar, Kanpur', true, '2026-10-12'),
('park-facing-2bhk', 'Park Facing 2BHK', 'Peaceful 2BHK apartment facing a large park. Excellent view and calm environment.', 20000, 40000, 1800, 'Apartment', 2, 2, 1100, 4, 6, 'Family', 'Semi-Furnished', 'AVAILABLE', (SELECT id FROM locations WHERE slug = 'shastri-nagar'), 'Shastri Nagar, Kanpur', false, '2026-10-07'),
('compact-1bhk-flat', 'Compact 1BHK Flat', 'Compact and efficient 1BHK perfect for singles. Well-designed space with all necessary amenities.', 10000, 20000, 1000, 'Apartment', 1, 1, 500, 1, 3, 'Bachelor', 'Unfurnished', 'AVAILABLE', (SELECT id FROM locations WHERE slug = 'barra'), 'Barra, Kanpur', false, '2026-10-04'),
('3bhk-with-terrace-garden', '3BHK with Terrace Garden', 'Spacious 3BHK with private terrace garden. Perfect for families who love outdoor space.', 32000, 64000, 2800, 'Apartment', 3, 3, 1700, 5, 8, 'Family', 'Semi-Furnished', 'AVAILABLE', (SELECT id FROM locations WHERE slug = 'panki'), 'Panki, Kanpur', false, '2026-10-18')
ON CONFLICT (slug) DO NOTHING;

-- Seed Property Images (placeholder URLs - replace with actual Supabase Storage URLs)
INSERT INTO property_images (property_id, image_url, is_primary, sort_order) 
SELECT 
  p.id,
  'https://via.placeholder.com/800x600/0F766E/00C2D9?text=' || p.title,
  true,
  0
FROM properties p
ON CONFLICT DO NOTHING;

-- Seed FAQs
INSERT INTO faqs (question, answer, category, sort_order, is_active) VALUES
('How do I search for rental properties?', 'You can use our search filters to find properties by location, BHK, price range, and tenant type. Simply visit the Rentals page and apply your preferred filters.', 'General', 1, true),
('What documents do I need to rent a property?', 'Typically, you will need ID proof (Aadhaar/PAN), address proof, income proof, and passport-size photos. For working professionals, employment verification may also be required.', 'Rentals', 2, true),
('Is there a brokerage fee?', 'Yes, we charge a transparent 1-month brokerage fee from tenants. Landlords can list their properties free for the first 60 days.', 'Pricing', 3, true),
('How do I schedule a property visit?', 'You can schedule a visit by clicking the "Schedule Tour" button on any property details page. Fill in your details and preferred time, and our agent will confirm with you.', 'Rentals', 4, true),
('What is the security deposit amount?', 'Security deposit is typically 2 months of rent, but it varies by property. The exact amount is mentioned in each property listing.', 'Pricing', 5, true),
('Can I negotiate the rent?', 'Yes, rent negotiation is possible in many cases. Our agents can help you negotiate with the landlord to get the best deal.', 'Rentals', 6, true),
('How long does the rental agreement last?', 'Standard rental agreements are for 11 months, renewable annually. However, this can vary based on mutual agreement between tenant and landlord.', 'Legal', 7, true),
('What amenities are included in the rent?', 'Amenities vary by property. Each listing clearly mentions what is included - parking, maintenance, water, etc.', 'Rentals', 8, true),
('Do you help with lease documentation?', 'Yes, we provide complete assistance with lease drafting, registration, and documentation to ensure a smooth process.', 'Services', 9, true),
('What areas do you cover in Kanpur?', 'We cover 43+ neighborhoods across Kanpur including Gurudev Chauraha, Kakadeo, Vijay Nagar, Vikas Nagar, Civil Lines, and many more.', 'General', 10, true)
ON CONFLICT DO NOTHING;

-- Seed Testimonials
INSERT INTO testimonials (name, role, location, quote, avatar_initials, rating, is_featured, sort_order, is_active) VALUES
('Jyoti Mishra', 'Tenant', 'Kakadeo', 'PrimeHomeKanpur made the entire rental-search process surprisingly easy. The interface is smooth, the details are clear, and I actually enjoyed comparing different places.', 'JM', 5, true, 1, true),
('Ankit Rao', 'Working Professional', 'Vikas Nagar', 'Found my 2BHK in Vikas Nagar within a week. The agent was responsive and the paperwork was handled professionally.', 'AR', 5, false, 2, true),
('Kavita Pathak', 'Property Owner', 'Awadhpuri', 'As a landlord, they screened tenants thoroughly and my property was vacant for only 10 days. Highly recommended.', 'KP', 5, false, 3, true),
('Shubham Lal', 'Bachelor', 'Swaroop Nagar', 'The verified listings saved me a lot of time. Photos matched reality exactly and the rent was fair.', 'SL', 5, false, 4, true),
('Vinod Gupta', 'Family', 'Vijay Nagar', 'Rajesh ji helped us find a 3BHK in Vijay Nagar within 5 days. We are a family of 5 with specific needs — he patiently showed us 8 properties and negotiated the rent down by ₹4,000. Truly professional service!', 'VG', 5, false, 5, true),
('Rohan Singh', 'Software Engineer', 'Kakadeo', 'As a bachelor moving to Kanpur from Delhi, I was worried about getting scammed. PrimeHomeKanpur verified listings gave me confidence. I signed my Kakadeo flat within 48 hours and everything matched the photos exactly.', 'RS', 5, false, 6, true),
('Meeta Trivedi', 'Property Owner', '4 Properties', 'I own 4 properties in Awadhpuri and Swaroop Nagar. Earlier I was managing everything myself — bad tenants, delayed rent, constant calls. Since handing everything to PrimeHomeKanpur 3 years ago, I have not had a single vacancy for more than 2 weeks. Worth every rupee.', 'MT', 5, false, 7, true)
ON CONFLICT DO NOTHING;
