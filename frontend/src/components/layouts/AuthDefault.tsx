interface AuthDefaultPage extends React.ComponentProps<'div'> {
  title: string
  func: () => any
}

const AuthDefault = ({ title, func, children }: AuthDefaultPage) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6]">
      <form
        onSubmit={func}
        className="w-full max-w-sm bg-white shadow-md rounded-md px-8 pt-6 pb-8"
      >
        <img
          src="/gdash-logo-colorful.png"
          alt="GDash logo"
          className="mx-auto mb-3 h-18"
        />

        <h1 className="text-2xl font-bold mb-8 text-center">{title}</h1>

        {children}
      </form>
    </div>
  )
}

export default AuthDefault
