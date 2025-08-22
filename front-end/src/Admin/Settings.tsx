import CategoryManager from './CategoryManager'
import UpdateFooter from './components/UpdateFooter'

const Settings = () => {
  return (
    <div className="p-6 space-y-6 w-5xl flex flex-col items-center">
      <CategoryManager />
      <UpdateFooter />
    </div>
  )
}

export default Settings