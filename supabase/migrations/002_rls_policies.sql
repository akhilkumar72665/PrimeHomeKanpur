-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- PROFILES RLS POLICIES

-- Allow public read (for profile lookups)
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow service role to insert profiles (handled by trigger)
CREATE POLICY "Service role can insert profiles" ON profiles
  FOR INSERT WITH CHECK (true);

-- PROPERTIES RLS POLICIES

-- Public can view available properties
CREATE POLICY "Available properties are viewable by everyone" ON properties
  FOR SELECT USING (status = 'AVAILABLE');

-- Public can view all properties (for agents/admin context)
CREATE POLICY "All properties are viewable by authenticated users" ON properties
  FOR SELECT USING (auth.role() = 'authenticated');

-- Service role can manage all properties
CREATE POLICY "Service role can manage properties" ON properties
  FOR ALL USING (auth.role() = 'service_role');

-- PROPERTY_IMAGES RLS POLICIES

-- Public can view property images
CREATE POLICY "Property images are viewable by everyone" ON property_images
  FOR SELECT USING (true);

-- Service role can manage property images
CREATE POLICY "Service role can manage property images" ON property_images
  FOR ALL USING (auth.role() = 'service_role');

-- AMENITIES RLS POLICIES

-- Public can view amenities
CREATE POLICY "Amenities are viewable by everyone" ON amenities
  FOR SELECT USING (true);

-- Service role can manage amenities
CREATE POLICY "Service role can manage amenities" ON amenities
  FOR ALL USING (auth.role() = 'service_role');

-- PROPERTY_AMENITIES RLS POLICIES

-- Public can view property amenities
CREATE POLICY "Property amenities are viewable by everyone" ON property_amenities
  FOR SELECT USING (true);

-- Service role can manage property amenities
CREATE POLICY "Service role can manage property amenities" ON property_amenities
  FOR ALL USING (auth.role() = 'service_role');

-- AGENTS RLS POLICIES

-- Public can view active agents
CREATE POLICY "Active agents are viewable by everyone" ON agents
  FOR SELECT USING (is_active = true);

-- Authenticated users can view all agents
CREATE POLICY "All agents are viewable by authenticated users" ON agents
  FOR SELECT USING (auth.role() = 'authenticated');

-- Service role can manage agents
CREATE POLICY "Service role can manage agents" ON agents
  FOR ALL USING (auth.role() = 'service_role');

-- INQUIRIES RLS POLICIES

-- Public can create inquiries
CREATE POLICY "Anyone can create inquiries" ON inquiries
  FOR INSERT WITH CHECK (true);

-- Users can view their own inquiries
CREATE POLICY "Users can view own inquiries" ON inquiries
  FOR SELECT USING (auth.uid() = user_id);

-- Service role can manage all inquiries
CREATE POLICY "Service role can manage inquiries" ON inquiries
  FOR ALL USING (auth.role() = 'service_role');

-- FAVORITES RLS POLICIES

-- Authenticated users can create favorites
CREATE POLICY "Authenticated users can create favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can view their own favorites
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Service role can manage all favorites
CREATE POLICY "Service role can manage favorites" ON favorites
  FOR ALL USING (auth.role() = 'service_role');

-- FAQs RLS POLICIES

-- Public can view active FAQs
CREATE POLICY "Active FAQs are viewable by everyone" ON faqs
  FOR SELECT USING (is_active = true);

-- Authenticated users can view all FAQs
CREATE POLICY "All FAQs are viewable by authenticated users" ON faqs
  FOR SELECT USING (auth.role() = 'authenticated');

-- Service role can manage FAQs
CREATE POLICY "Service role can manage FAQs" ON faqs
  FOR ALL USING (auth.role() = 'service_role');

-- TESTIMONIALS RLS POLICIES

-- Public can view active testimonials
CREATE POLICY "Active testimonials are viewable by everyone" ON testimonials
  FOR SELECT USING (is_active = true);

-- Authenticated users can view all testimonials
CREATE POLICY "All testimonials are viewable by authenticated users" ON testimonials
  FOR SELECT USING (auth.role() = 'authenticated');

-- Service role can manage testimonials
CREATE POLICY "Service role can manage testimonials" ON testimonials
  FOR ALL USING (auth.role() = 'service_role');

-- CONTACT_MESSAGES RLS POLICIES

-- Public can create contact messages
CREATE POLICY "Anyone can create contact messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Service role can view all contact messages
CREATE POLICY "Service role can view contact messages" ON contact_messages
  FOR SELECT USING (auth.role() = 'service_role');

-- NEWSLETTER_SUBSCRIBERS RLS POLICIES

-- Public can subscribe to newsletter
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Service role can manage newsletter subscribers
CREATE POLICY "Service role can manage newsletter subscribers" ON newsletter_subscribers
  FOR ALL USING (auth.role() = 'service_role');

-- LOCATIONS RLS POLICIES

-- Public can view active locations
CREATE POLICY "Active locations are viewable by everyone" ON locations
  FOR SELECT USING (is_active = true);

-- Authenticated users can view all locations
CREATE POLICY "All locations are viewable by authenticated users" ON locations
  FOR SELECT USING (auth.role() = 'authenticated');

-- Service role can manage locations
CREATE POLICY "Service role can manage locations" ON locations
  FOR ALL USING (auth.role() = 'service_role');
