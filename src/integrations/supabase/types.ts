export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      candidate_documents: {
        Row: {
          candidate_id: string
          file_name: string
          file_path: string
          file_size_bytes: number | null
          file_type: string
          id: string
          uploaded_at: string
          user_id: string
        }
        Insert: {
          candidate_id: string
          file_name: string
          file_path: string
          file_size_bytes?: number | null
          file_type?: string
          id?: string
          uploaded_at?: string
          user_id: string
        }
        Update: {
          candidate_id?: string
          file_name?: string
          file_path?: string
          file_size_bytes?: number | null
          file_type?: string
          id?: string
          uploaded_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_documents_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      candidates: {
        Row: {
          assigned_support_agent: string | null
          availability: Database["public"]["Enums"]["availability_type"] | null
          challenge_story: string | null
          challenges: string[] | null
          city_country: string | null
          consent_contact: boolean
          consent_privacy: boolean
          created_at: string
          cv_link: string | null
          date_of_birth: string | null
          education_level:
            | Database["public"]["Enums"]["education_level_type"]
            | null
          email: string | null
          email_verified: boolean
          english_capability:
            | Database["public"]["Enums"]["english_capability_type"]
            | null
          english_level:
            | Database["public"]["Enums"]["english_level_type"]
            | null
          experience_years: number | null
          full_name: string
          graduation_year: number | null
          help_needed: string[] | null
          id: string
          journey_stage: Database["public"]["Enums"]["journey_stage_type"]
          license_status:
            | Database["public"]["Enums"]["license_status_type"]
            | null
          motivation_story: string | null
          motivations: string[] | null
          pipeline_status: Database["public"]["Enums"]["pipeline_status_type"]
          profession: Database["public"]["Enums"]["profession_type"] | null
          specialty: Database["public"]["Enums"]["specialty_type"] | null
          str_active_number: string | null
          target_countries: string[]
          university: string | null
          user_id: string | null
          whatsapp_number: string
          whatsapp_verified: boolean
        }
        Insert: {
          assigned_support_agent?: string | null
          availability?: Database["public"]["Enums"]["availability_type"] | null
          challenge_story?: string | null
          challenges?: string[] | null
          city_country?: string | null
          consent_contact?: boolean
          consent_privacy?: boolean
          created_at?: string
          cv_link?: string | null
          date_of_birth?: string | null
          education_level?:
            | Database["public"]["Enums"]["education_level_type"]
            | null
          email?: string | null
          email_verified?: boolean
          english_capability?:
            | Database["public"]["Enums"]["english_capability_type"]
            | null
          english_level?:
            | Database["public"]["Enums"]["english_level_type"]
            | null
          experience_years?: number | null
          full_name: string
          graduation_year?: number | null
          help_needed?: string[] | null
          id?: string
          journey_stage?: Database["public"]["Enums"]["journey_stage_type"]
          license_status?:
            | Database["public"]["Enums"]["license_status_type"]
            | null
          motivation_story?: string | null
          motivations?: string[] | null
          pipeline_status?: Database["public"]["Enums"]["pipeline_status_type"]
          profession?: Database["public"]["Enums"]["profession_type"] | null
          specialty?: Database["public"]["Enums"]["specialty_type"] | null
          str_active_number?: string | null
          target_countries?: string[]
          university?: string | null
          user_id?: string | null
          whatsapp_number: string
          whatsapp_verified?: boolean
        }
        Update: {
          assigned_support_agent?: string | null
          availability?: Database["public"]["Enums"]["availability_type"] | null
          challenge_story?: string | null
          challenges?: string[] | null
          city_country?: string | null
          consent_contact?: boolean
          consent_privacy?: boolean
          created_at?: string
          cv_link?: string | null
          date_of_birth?: string | null
          education_level?:
            | Database["public"]["Enums"]["education_level_type"]
            | null
          email?: string | null
          email_verified?: boolean
          english_capability?:
            | Database["public"]["Enums"]["english_capability_type"]
            | null
          english_level?:
            | Database["public"]["Enums"]["english_level_type"]
            | null
          experience_years?: number | null
          full_name?: string
          graduation_year?: number | null
          help_needed?: string[] | null
          id?: string
          journey_stage?: Database["public"]["Enums"]["journey_stage_type"]
          license_status?:
            | Database["public"]["Enums"]["license_status_type"]
            | null
          motivation_story?: string | null
          motivations?: string[] | null
          pipeline_status?: Database["public"]["Enums"]["pipeline_status_type"]
          profession?: Database["public"]["Enums"]["profession_type"] | null
          specialty?: Database["public"]["Enums"]["specialty_type"] | null
          str_active_number?: string | null
          target_countries?: string[]
          university?: string | null
          user_id?: string | null
          whatsapp_number?: string
          whatsapp_verified?: boolean
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          status: Database["public"]["Enums"]["chat_conv_status_type"]
          updated_at: string
          user_identifier: string
        }
        Insert: {
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["chat_conv_status_type"]
          updated_at?: string
          user_identifier: string
        }
        Update: {
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["chat_conv_status_type"]
          updated_at?: string
          user_identifier?: string
        }
        Relationships: []
      }
      chat_escalation_tickets: {
        Row: {
          assigned_to: string | null
          conversation_id: string | null
          created_at: string
          email: string | null
          first_response_at: string | null
          id: string
          issue_summary: string
          name: string | null
          priority: Database["public"]["Enums"]["escalation_priority_type"]
          resolved_at: string | null
          status: Database["public"]["Enums"]["escalation_status_type"]
          whatsapp: string | null
        }
        Insert: {
          assigned_to?: string | null
          conversation_id?: string | null
          created_at?: string
          email?: string | null
          first_response_at?: string | null
          id?: string
          issue_summary: string
          name?: string | null
          priority?: Database["public"]["Enums"]["escalation_priority_type"]
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["escalation_status_type"]
          whatsapp?: string | null
        }
        Update: {
          assigned_to?: string | null
          conversation_id?: string | null
          created_at?: string
          email?: string | null
          first_response_at?: string | null
          id?: string
          issue_summary?: string
          name?: string | null
          priority?: Database["public"]["Enums"]["escalation_priority_type"]
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["escalation_status_type"]
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_escalation_tickets_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          admin_notes: string | null
          created_at: string
          id: string
          message: string
          resolved_at: string | null
          resolved_by: string | null
          status: string
          updated_at: string
          visitor_email: string | null
          visitor_name: string
          visitor_phone: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          message: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          updated_at?: string
          visitor_email?: string | null
          visitor_name: string
          visitor_phone?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          message?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          updated_at?: string
          visitor_email?: string | null
          visitor_name?: string
          visitor_phone?: string | null
        }
        Relationships: []
      }
      content: {
        Row: {
          body: string
          category: Database["public"]["Enums"]["content_category_type"]
          created_at: string
          excerpt: string
          hero_image: string | null
          id: string
          is_published: boolean
          publish_date: string
          read_time_minutes: number
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          body: string
          category: Database["public"]["Enums"]["content_category_type"]
          created_at?: string
          excerpt: string
          hero_image?: string | null
          id?: string
          is_published?: boolean
          publish_date?: string
          read_time_minutes?: number
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          category?: Database["public"]["Enums"]["content_category_type"]
          created_at?: string
          excerpt?: string
          hero_image?: string | null
          id?: string
          is_published?: boolean
          publish_date?: string
          read_time_minutes?: number
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_items: {
        Row: {
          body: string
          country_focus: string | null
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          publish_date: string | null
          published: boolean
          slug: string
          tags: string[] | null
          title: string
          type: Database["public"]["Enums"]["content_item_type"]
          updated_at: string
        }
        Insert: {
          body: string
          country_focus?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          publish_date?: string | null
          published?: boolean
          slug: string
          tags?: string[] | null
          title: string
          type: Database["public"]["Enums"]["content_item_type"]
          updated_at?: string
        }
        Update: {
          body?: string
          country_focus?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          publish_date?: string | null
          published?: boolean
          slug?: string
          tags?: string[] | null
          title?: string
          type?: Database["public"]["Enums"]["content_item_type"]
          updated_at?: string
        }
        Relationships: []
      }
      conversation_messages: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          message_text: string
          sender: Database["public"]["Enums"]["chat_sender_type"]
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          message_text: string
          sender: Database["public"]["Enums"]["chat_sender_type"]
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          message_text?: string
          sender?: Database["public"]["Enums"]["chat_sender_type"]
        }
        Relationships: [
          {
            foreignKeyName: "conversation_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      employer_inquiries: {
        Row: {
          company_name: string | null
          contact_mobile: string | null
          contact_name: string | null
          country: string | null
          created_at: string
          email: string | null
          employer_status: Database["public"]["Enums"]["employer_status_type"]
          id: string
          institution_name: string | null
          institutional_email: string | null
          message: string | null
          nurses_needed: number | null
          phone: string | null
          preferred_timeline: string | null
          specialties_needed: string[] | null
          status: string
          title: string | null
          updated_at: string
          workforce_needs: string | null
        }
        Insert: {
          company_name?: string | null
          contact_mobile?: string | null
          contact_name?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          employer_status?: Database["public"]["Enums"]["employer_status_type"]
          id?: string
          institution_name?: string | null
          institutional_email?: string | null
          message?: string | null
          nurses_needed?: number | null
          phone?: string | null
          preferred_timeline?: string | null
          specialties_needed?: string[] | null
          status?: string
          title?: string | null
          updated_at?: string
          workforce_needs?: string | null
        }
        Update: {
          company_name?: string | null
          contact_mobile?: string | null
          contact_name?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          employer_status?: Database["public"]["Enums"]["employer_status_type"]
          id?: string
          institution_name?: string | null
          institutional_email?: string | null
          message?: string | null
          nurses_needed?: number | null
          phone?: string | null
          preferred_timeline?: string | null
          specialties_needed?: string[] | null
          status?: string
          title?: string | null
          updated_at?: string
          workforce_needs?: string | null
        }
        Relationships: []
      }
      faq_items: {
        Row: {
          answer: string
          category: Database["public"]["Enums"]["faq_category_type"]
          created_at: string
          id: string
          priority: number
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          category?: Database["public"]["Enums"]["faq_category_type"]
          created_at?: string
          id?: string
          priority?: number
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: Database["public"]["Enums"]["faq_category_type"]
          created_at?: string
          id?: string
          priority?: number
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      pathways: {
        Row: {
          country: string
          created_at: string
          documents_checklist: Json
          faq: Json
          id: string
          is_active: boolean
          order_index: number
          requirements: Json
          short_summary: string
          slug: string
          timeline_steps: Json
          title: string
          updated_at: string
        }
        Insert: {
          country: string
          created_at?: string
          documents_checklist?: Json
          faq?: Json
          id?: string
          is_active?: boolean
          order_index?: number
          requirements?: Json
          short_summary: string
          slug: string
          timeline_steps?: Json
          title: string
          updated_at?: string
        }
        Update: {
          country?: string
          created_at?: string
          documents_checklist?: Json
          faq?: Json
          id?: string
          is_active?: boolean
          order_index?: number
          requirements?: Json
          short_summary?: string
          slug?: string
          timeline_steps?: Json
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quickstart_chapters: {
        Row: {
          body: string
          created_at: string
          id: string
          is_published: boolean
          order_index: number
          slug: string
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          is_published?: boolean
          order_index?: number
          slug: string
          summary: string
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_published?: boolean
          order_index?: number
          slug?: string
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value?: string
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string
          id: string
          instagram_url: string
          linkedin_url: string
          tiktok_url: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          instagram_url?: string
          linkedin_url?: string
          tiktok_url?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          instagram_url?: string
          linkedin_url?: string
          tiktok_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      success_stories: {
        Row: {
          body: string
          created_at: string
          destination_country: string
          excerpt: string
          hero_image: string | null
          id: string
          is_published: boolean
          nurse_name: string
          origin_country: string
          publish_date: string
          slug: string
          specialty: string | null
          title: string
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          destination_country: string
          excerpt: string
          hero_image?: string | null
          id?: string
          is_published?: boolean
          nurse_name: string
          origin_country: string
          publish_date?: string
          slug: string
          specialty?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          destination_country?: string
          excerpt?: string
          hero_image?: string | null
          id?: string
          is_published?: boolean
          nurse_name?: string
          origin_country?: string
          publish_date?: string
          slug?: string
          specialty?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webinar_registrations: {
        Row: {
          email: string
          full_name: string
          id: string
          notes: string | null
          registered_at: string
          webinar_id: string
          whatsapp: string
        }
        Insert: {
          email: string
          full_name: string
          id?: string
          notes?: string | null
          registered_at?: string
          webinar_id: string
          whatsapp: string
        }
        Update: {
          email?: string
          full_name?: string
          id?: string
          notes?: string | null
          registered_at?: string
          webinar_id?: string
          whatsapp?: string
        }
        Relationships: [
          {
            foreignKeyName: "webinar_registrations_webinar_id_fkey"
            columns: ["webinar_id"]
            isOneToOne: false
            referencedRelation: "webinars"
            referencedColumns: ["id"]
          },
        ]
      }
      webinars: {
        Row: {
          contact_email: string | null
          cost: string
          cover_image_url: string | null
          created_at: string
          description: string | null
          event_date: string | null
          id: string
          is_featured: boolean
          is_published: boolean
          learn_items: string[]
          order_index: number
          register_link: string | null
          schedule: string | null
          slug: string | null
          speaker_bio: string | null
          speaker_name: string | null
          speaker_photo_url: string | null
          subtitle: string | null
          title: string
          topic: string | null
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          cost?: string
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          learn_items?: string[]
          order_index?: number
          register_link?: string | null
          schedule?: string | null
          slug?: string | null
          speaker_bio?: string | null
          speaker_name?: string | null
          speaker_photo_url?: string | null
          subtitle?: string | null
          title: string
          topic?: string | null
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          cost?: string
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          learn_items?: string[]
          order_index?: number
          register_link?: string | null
          schedule?: string | null
          slug?: string | null
          speaker_bio?: string | null
          speaker_name?: string | null
          speaker_photo_url?: string | null
          subtitle?: string | null
          title?: string
          topic?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      whatsapp_groups: {
        Row: {
          created_at: string
          description: string
          id: string
          is_active: boolean
          join_link: string
          order_index: number
          segment_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
          join_link?: string
          order_index?: number
          segment_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          join_link?: string
          order_index?: number
          segment_name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      availability_type: "0-3 months" | "3-6 months" | "6-12 months"
      chat_conv_status_type: "AI" | "Escalated" | "Closed"
      chat_sender_type: "user" | "ai" | "human"
      content_category_type:
        | "Career Abroad"
        | "Licensing"
        | "English"
        | "Interview"
        | "Mental Health"
        | "Professional Growth"
        | "News"
        | "Success Story"
      content_item_type: "QuickstartChapter" | "News" | "SuccessStory"
      education_level_type: "Diploma" | "Bachelor" | "Master" | "Other"
      employer_status_type: "New" | "Contacted" | "Meeting Booked" | "Closed"
      english_capability_type: "Basic" | "Intermediate" | "Fluent"
      english_level_type:
        | "IELTS"
        | "OET"
        | "Basic"
        | "Intermediate"
        | "Advanced"
        | "Not Yet"
      escalation_priority_type: "Low" | "Normal" | "High"
      escalation_status_type: "Open" | "Assigned" | "In Progress" | "Resolved"
      faq_category_type:
        | "General"
        | "Registration"
        | "English"
        | "Licensing"
        | "Pathways"
        | "Privacy"
        | "Employer"
      journey_stage_type:
        | "New"
        | "Contacted"
        | "Screening"
        | "Preparing"
        | "Ready"
        | "Placed"
        | "Closed"
      license_status_type: "STR/SIP Active" | "In Process" | "Not Available"
      pipeline_status_type:
        | "new"
        | "contacted"
        | "screened"
        | "qualified"
        | "in_process"
        | "placed"
        | "closed"
      profession_type: "Nurse" | "Midwife" | "Other"
      specialty_type:
        | "ICU"
        | "ER"
        | "Med-Surg"
        | "OR"
        | "Pediatrics"
        | "Geriatric"
        | "Mental Health"
        | "Community Health"
        | "Other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      availability_type: ["0-3 months", "3-6 months", "6-12 months"],
      chat_conv_status_type: ["AI", "Escalated", "Closed"],
      chat_sender_type: ["user", "ai", "human"],
      content_category_type: [
        "Career Abroad",
        "Licensing",
        "English",
        "Interview",
        "Mental Health",
        "Professional Growth",
        "News",
        "Success Story",
      ],
      content_item_type: ["QuickstartChapter", "News", "SuccessStory"],
      education_level_type: ["Diploma", "Bachelor", "Master", "Other"],
      employer_status_type: ["New", "Contacted", "Meeting Booked", "Closed"],
      english_capability_type: ["Basic", "Intermediate", "Fluent"],
      english_level_type: [
        "IELTS",
        "OET",
        "Basic",
        "Intermediate",
        "Advanced",
        "Not Yet",
      ],
      escalation_priority_type: ["Low", "Normal", "High"],
      escalation_status_type: ["Open", "Assigned", "In Progress", "Resolved"],
      faq_category_type: [
        "General",
        "Registration",
        "English",
        "Licensing",
        "Pathways",
        "Privacy",
        "Employer",
      ],
      journey_stage_type: [
        "New",
        "Contacted",
        "Screening",
        "Preparing",
        "Ready",
        "Placed",
        "Closed",
      ],
      license_status_type: ["STR/SIP Active", "In Process", "Not Available"],
      pipeline_status_type: [
        "new",
        "contacted",
        "screened",
        "qualified",
        "in_process",
        "placed",
        "closed",
      ],
      profession_type: ["Nurse", "Midwife", "Other"],
      specialty_type: [
        "ICU",
        "ER",
        "Med-Surg",
        "OR",
        "Pediatrics",
        "Geriatric",
        "Mental Health",
        "Community Health",
        "Other",
      ],
    },
  },
} as const
