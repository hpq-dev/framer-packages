import { useEffect } from "react"
import anime from "animejs"
import { useRouter } from "framer"

/**
 *
 * @framerIntrinsicWidth 200
 * @framerIntrinsicHeight 200
 *
 * @framerDisableUnlink
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */

export default function Transition() {
    const router = useRouter()

    useEffect(() => {
        const style = document.createElement("style")
        style.innerHTML = `
            #__framer-badge-container { display: none !important; }
            ::-webkit-scrollbar { width: 0px; }
            scrollbar-width: none;
            -ms-overflow-style: none;
            overflow: -moz-scrollbars-none;
            overscrollBehavior: "contain";
        `
        document.head.appendChild(style)

        const mainElement = document.getElementById("main")
        if (mainElement) {
            let routes = {}
            for (const key in router.routes) {
                if (router.routes[key].path) {
                    routes[router.routes[key].path] = key
                }
            }

            const links: any = document.querySelectorAll("a")

            links.forEach((link: any) => {
                const button = document.createElement("button")

                button.innerHTML = link.innerHTML

                for (const attr of link.attributes as any) {
                    button.setAttribute(attr.name, attr.value)
                }

                link.parentNode.replaceChild(button, link)
                button.addEventListener("click", (e: any) => {
                    const url: string = link.href.split("/")
                    const id: string = "/" + url[url.length - 1]

                    const { element } = useTransitionIn(mainElement)

                    setTimeout(() => {
                        useTransitionOut(mainElement)
                        element.remove()
                        router.navigate(routes[id], "")
                    }, 2000)
                })
            })
        }
    }, [])

    return <></>
}

const useTransitionIn = (mainElement: any) => {
    const element = document.createElement("div")
    mainElement.appendChild(element)

    const time: number = 500

    element.style.position = "fixed"
    element.style.top = "50%"
    element.style.left = "50%"
    element.style.transform = "translate(-50%,-50%)"
    element.style.width = "100vw"
    element.style.height = "100vh"
    element.style.outline = "0vh solid #000"
    element.style.zIndex = "9999"

    setTimeout(
        () =>
            (element.style.transition = `${
                time / 1000
            }s ease-out, background .3s ease-out`),
        10
    )

    setTimeout(() => {
        element.style.width = "20vw"
        element.style.height = ".2vh"
        element.style.outline = "100vh solid #000"
        setTimeout(() => {
            let i = 0
            setInterval(
                () => (element.style.background = ["#fff", "#333"][++i % 2]),
                300
            )
        }, time)
    }, 50)

    return { element }
}

const useTransitionOut = (mainElement: any) => {
    const element = document.createElement("div")
    mainElement.appendChild(element)

    const time: number = 500

    element.style.position = "fixed"
    element.style.top = "50%"
    element.style.left = "50%"
    element.style.transform = "translate(-50%,-50%)"
    element.style.width = "20vw"
    element.style.height = ".2vh"
    element.style.outline = "100vh solid #000"
    element.style.zIndex = "9999"
    element.style.background = "#fff"

    setTimeout(
        () =>
            (element.style.transition = `${
                time / 1000
            }s ease-out, background .3s ease-out`),
        10
    )

    setTimeout(() => {
        element.style.width = "100vw"
        element.style.height = "100vh"
        element.style.outline = "0vh solid #000"
        element.style.background = "transparent"

        setTimeout(() => element.remove(), time)
    }, 1000)
}
