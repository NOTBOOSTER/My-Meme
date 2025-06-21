const userProfile = async ({params}) => {
  const { user } = await params
  return (
    <div>
      {user}
    </div>
  )
}

export default userProfile
