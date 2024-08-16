import { UserModel } from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { createToken } from '../services/jwt.js'
import dotenv from "dotenv"

dotenv.config()

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS)

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' })
    }

    const userExists = await UserModel.getByEmail({ email })
    if (userExists.length > 0) {
      return res.status(400).json({ message: 'Ya existe un usuario con este correo.' })
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    const hashedPassword = await bcrypt.hash(password, salt)

    UserModel.create({ name, email, password: hashedPassword })

    return res.status(201).json({ message: 'Usuario creado con exito' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' })
    }

    const user = await UserModel.getByEmail({ email })
    if (user.length === 0) {
      return res.status(400).json({ message: 'Usuario no encontrado' })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return res.status(400).json({ message: 'Contraseña incorrecta' })
    }

    const token = createToken(user)

    return res.status(200).json({
      message: 'Usuario loggeado con exito',
      user: {
        name: user.name,
        email: user.email
      },
      token
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message })
  }
}

export const studentsForm = async (req, res) => {
  try {
    const { document } = req.body

    if (!document) {
      return res.status(400).json({ message: 'No se ha proporcionado el numero de documento' })
    }

    fetch("https://api.talentotech.cymetria.com/api/v1/blockchain/obtener-estudiantes-aprobados")
      .then(response => response.json())
      .then(data => {
        const students_approved = data.estudiantes_aprobados
        const matchDocument = students_approved.filter(student => parseInt(student.estudiante.num_documento) === parseInt(document))
        if (matchDocument.length === 0) {
          return res.status(404).json({ message: 'Estudiante no encontrado' })
        }
        return res.status(200).json({
          message: 'Estudiante encontrado',
          estudiante: {
            nombre: `${matchDocument[0].estudiante.nombres} ${matchDocument[0].estudiante.apellidos}`,
            num_documento: matchDocument[0].estudiante.num_documento,
            email: matchDocument[0].estudiante.email,
            nombre_curso: matchDocument[0].curso.nombreCurso,
          }
        })
      })

  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}