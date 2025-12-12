export default async function UserProfile({ params } : { params : Promise<{id : number}>}){
    
    let { id } = await params;
    console.log(id)
    return (
        <div>
            <h1>Profile</h1>
            <hr />
            <p className="text-4xl">profile page {id}</p>
        </div>
    )
}