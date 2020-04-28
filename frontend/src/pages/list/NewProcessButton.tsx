import React, { useState } from 'react'

import Button from '@kiwicom/orbit-components/lib/Button'
import client from '../../client'
import { mutate } from 'swr'

const NewProcessButton = () => {
  const [loading, setLoading] = useState(false)
  const createNewProcess = async () => {
    const bid = 'test' //  window.prompt('Insert booking id', '88491656')
    if (bid) {
      setLoading(true)
      try {
        const data = await client.post('/start')
        mutate(`/state?id=${data.id}`, data)
        window.location.href = `/process/${data.id}`
      } catch (e) {
        setLoading(false)
        console.error(e)
      }
    }
  }
  return (
    <Button loading={loading} onClick={createNewProcess}>
      New process
    </Button>
  )
}

export default NewProcessButton
