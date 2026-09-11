import 'dotenv/config'
import express from 'express'
import pg from 'pg'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const { Pool } = pg
const app = express()
const port = process.env.PORT || 3001
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const currentDirectory = path.dirname(fileURLToPath(import.meta.url))

app.use(express.json({ limit: '5mb' }))

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      data JSONB NOT NULL,
      template TEXT,
      accent TEXT,
      saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS share_links (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
}

app.post('/api/shares', async (request, response) => {
  const { id, type, data } = request.body
  if (!id || !type || !data) return response.status(400).json({ error: 'Data share tidak lengkap' })

  try {
    await pool.query('INSERT INTO share_links (id, type, data) VALUES ($1, $2, $3)', [id, type, data])
    response.status(201).json({ id })
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Tidak dapat mencipta share link' })
  }
})

app.get('/api/shares/:id', async (request, response) => {
  try {
    const { rows } = await pool.query('SELECT type, data FROM share_links WHERE id = $1', [request.params.id])
    if (!rows[0]) return response.status(404).json({ error: 'Share link tidak dijumpai' })
    response.json(rows[0])
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Tidak dapat membaca share link' })
  }
})

app.get('/api/documents', async (_request, response) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, type, name, data, template, accent, saved_at AS "savedAt"
      FROM documents
      ORDER BY saved_at DESC
    `)
    response.json(rows)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Tidak dapat membaca dokumen' })
  }
})

app.post('/api/documents', async (request, response) => {
  const { id, type, name, data, template, accent, savedAt } = request.body
  if (!id || !type || !name || !data) return response.status(400).json({ error: 'Data dokumen tidak lengkap' })

  try {
    const { rows } = await pool.query(`
      INSERT INTO documents (id, type, name, data, template, accent, saved_at)
      VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7::timestamptz, NOW()))
      RETURNING id, type, name, data, template, accent, saved_at AS "savedAt"
    `, [id, type, name, data, template || null, accent || null, savedAt || null])
    response.status(201).json(rows[0])
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Tidak dapat menyimpan dokumen' })
  }
})

app.put('/api/documents/:id', async (request, response) => {
  const { type, name, data, template, accent, savedAt } = request.body
  try {
    const { rows } = await pool.query(`
      UPDATE documents
      SET type = $1, name = $2, data = $3, template = $4, accent = $5, saved_at = COALESCE($6::timestamptz, NOW())
      WHERE id = $7
      RETURNING id, type, name, data, template, accent, saved_at AS "savedAt"
    `, [type, name, data, template || null, accent || null, savedAt || null, request.params.id])
    if (!rows[0]) return response.status(404).json({ error: 'Dokumen tidak dijumpai' })
    response.json(rows[0])
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Tidak dapat mengemas kini dokumen' })
  }
})

app.delete('/api/documents/:id', async (request, response) => {
  try {
    await pool.query('DELETE FROM documents WHERE id = $1', [request.params.id])
    response.status(204).end()
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Tidak dapat membuang dokumen' })
  }
})

app.use(express.static(path.join(currentDirectory, 'dist')))
app.get(/^(?!\/api).*/, (_request, response) => {
  response.sendFile(path.join(currentDirectory, 'dist', 'index.html'))
})

ensureTable()
  .then(() => app.listen(port, () => console.log(`API database berjalan di http://localhost:${port}`)))
  .catch((error) => {
    console.error('Database tidak dapat disambungkan:', error.message)
    process.exit(1)
  })