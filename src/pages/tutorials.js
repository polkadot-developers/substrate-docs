import React from 'react'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import { useTutorials } from '../hooks/use-tutorials'
import TutorialList from '../components/tutorials/List'
import Sidebar from '../components/layout/Sidebar'
import NavDocs from '../components/site/NavDocs'

export default function TutorialsPage() {
  const { tutorials } = useTutorials()
  return (
    <Layout>
      <SEO title="Tutorials" />
      <div className="flex flex-col lg:flex-row">
        <Sidebar>
          <NavDocs currentPath="/tutorials/" />
        </Sidebar>

        <div className="px-4">
          <h1 className="text-center my-8 lg:my-12">Tutorials</h1>
          <div className="mb-40">
            <TutorialList models={tutorials} />
          </div>
        </div>
      </div>
    </Layout>
  )
}
