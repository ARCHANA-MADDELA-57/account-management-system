const supabase = require("../config/supabaseClient")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const generateToken = require("../utils/generateToken")

// SIGNUP
exports.signup = async (req, res) => {

  try {

    const { name, email, password } = req.body

    // Required fields validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }

    // Password length validation
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" })
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single()

    if (existingUser) {
      return res.status(400).json({ message: "User already registered. Please login." })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const { data, error } = await supabase
      .from("users")
      .insert({
        name,
        email,
        password: hashedPassword,
        balance: 10000
      })
      .select()

    if (error) throw error

    res.json({ message: "Signup successful" })

  } catch (error) {

    res.status(500).json({ message: error.message })

  }

}

// LOGIN
exports.login = async (req, res) => {

  try {

    const { email, password } = req.body

    // Required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single()

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" })
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    res.json({ token })

  } catch (error) {

    res.status(500).json({ message: error.message })

  }

}