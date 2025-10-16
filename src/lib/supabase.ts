import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database-ready storage functions
export const db = {
  // Products
  async getProducts() {
    const { data, error } = await supabase.from('products').select('*')
    if (error) throw error
    return data || []
  },

  async createProduct(product: any) {
    const { data, error } = await supabase.from('products').insert(product).select().single()
    if (error) throw error
    return data
  },

  async deleteProduct(id: string) {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error
  },

  // Orders
  async getOrders() {
    const { data, error } = await supabase.from('orders').select('*')
    if (error) throw error
    return data || []
  },

  async createOrder(order: any) {
    const { data, error } = await supabase.from('orders').insert(order).select().single()
    if (error) throw error
    return data
  },

  // Add more methods as needed...
}