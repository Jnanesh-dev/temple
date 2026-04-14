const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    const name = process.env.ADMIN_NAME?.trim() || 'Admin'
    const email = (process.env.ADMIN_EMAIL?.trim() || 'admin@temple.com').toLowerCase()
    const providedPassword = process.env.ADMIN_PASSWORD?.trim()

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser && !providedPassword) {
      console.log('✅ Admin user already exists')
      console.log(`   Email: ${existingUser.email}`)
      console.log('   Password unchanged. Set ADMIN_PASSWORD to rotate it explicitly.')
      return
    }

    const password = providedPassword || crypto.randomBytes(24).toString('base64url')
    const passwordHash = await bcrypt.hash(password, 10)

    const user = existingUser
      ? await prisma.user.update({
          where: { email },
          data: {
            name,
            passwordHash,
            role: 'admin',
          },
        })
      : await prisma.user.create({
          data: {
            name,
            email,
            passwordHash,
            role: 'admin',
          },
        })

    console.log(`✅ Admin user ${existingUser ? 'updated' : 'created'} successfully`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Password: ${password}`)
    if (!providedPassword) {
      console.log('   This password was generated automatically and is shown only once.')
    }
  } catch (error) {
    console.error('❌ Error creating admin:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
