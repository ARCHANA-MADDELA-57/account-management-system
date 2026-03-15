const supabase = require("../config/supabaseClient")
const bcrypt = require("bcryptjs")
const generateToken = require("../utils/generateToken")

// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single()

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // create user
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name,
          email,
          password: hashedPassword
        }
      ])
      .select()
      .single()

    if (error) throw error

    const token = generateToken(data)

    res.json({
      user: data,
      token
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// LOGIN
exports.login = async (req, res) => {
    try {
      const { email, password } = req.body
  
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single()
  
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" })
      }
  
      const isMatch = await bcrypt.compare(password, user.password)
  
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" })
      }
  
      const token = generateToken(user)
  
      res.json({
        user,
        token
      })
  
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }