import CategoryManager from './CategoryManager'
import ResumeUpload from './components/ResumeUpload'
import UpdateFooter from './components/UpdateFooter'

const Settings = () => {
  return (
    <div className="p-6 space-y-6 w-5xl flex flex-col items-center">
      <CategoryManager />
      <UpdateFooter />
      <ResumeUpload />
    </div>
  )
}

export default Settings