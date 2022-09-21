import { useRouteData } from "@solidjs/router";
import { Outlet } from "solid-start";
import {
  createServerAction$,
  createServerData$,
  redirect,
} from "solid-start/server";
import { getUser, logout } from "~/db/session";

export function routeData() {
  return createServerData$(async (_, { request }) => {
    const user = await getUser(request);

    if (!user) {
      throw redirect("/login");
    }

    return user;
  });
}

export default function ProtectedLayout() {
  const user = useRouteData<typeof routeData>();
  const [, { Form }] = createServerAction$((f: FormData, { request }) =>
    logout(request)
  );

  return (
    <div>
      <nav>
        <span>Signed in as {user()?.username}</span>
        <Form style={{ display: "inline-block", "margin-left": "10px" }}>
          <button name="logout" type="submit">
            Logout
          </button>
        </Form>
      </nav>
      <Outlet />
    </div>
  );
}
