import { useEffect, useState } from "react"
import anime from "animejs"
import { addPropertyControls, ControlType, useRouter } from "framer"

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

export default function Transition(props) {
    const router = useRouter()

    const [active, setActive] = useState<boolean>(false)

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

        const handler = (e: any, href) => {
            e.preventDefault()
            if (active) return

            let routes = {}
            for (const key in router.routes)
                if (router.routes[key].path)
                    routes[router.routes[key].path] = key

            const url: string = href.split("/")
            const id: string = "/" + url[url.length - 1]

            setActive(true)

            useTransitionIn({
                mainElement,
                time: props.transition * 1000,
                background: props.background,
                colors: [props.color1],
                type: props.type,
                onEnd: (boolean) => {
                    if (boolean) {
                        useTransitionOut({
                            mainElement,
                            time: props.transition * 1000,
                            background: props.background,
                            colors: [props.color1],
                            type: props.type,
                        })
                    }
                    router.navigate(routes[id], "")
                },
            })
        }

        const mainElement = document.getElementById("main")
        let buttons = []
        if (mainElement) {
            const links: any = document.querySelectorAll("a")

            links.forEach((link: any) => {
                if (!link.href.includes(window.location.origin)) return

                const newLink = document.createElement("a")
                buttons.push(newLink)

                newLink.innerHTML = link.innerHTML

                for (const attr of link.attributes as any)
                    newLink.setAttribute(attr.name, attr.value)

                newLink.style.cursor = "pointer"

                link.parentNode.replaceChild(newLink, link)
                newLink.addEventListener("click", (e) => handler(e, link.href))
            })
        }

        return () => {
            buttons.forEach((button) =>
                button.removeEventListener("click", (e) =>
                    handler(e, button.href)
                )
            )
            buttons = []
        }
    }, [active])

    return <></>
}

const useTransitionIn = (props) => {
    const { mainElement, time, background, onEnd, colors, type } = props

    const attrTransition = (element, transition) => {
        setTimeout(() => (element.style.transition = transition), 10)
    }

    switch (type) {
        case "linear": {
            const timeline = time / 2

            const element = document.createElement("div")
            mainElement.appendChild(element)
            element.style.position = "fixed"
            element.style.top = "50%"
            element.style.left = "50%"
            element.style.transform = "translate(-50%,-50%)"
            element.style.width = "100vw"
            element.style.height = "100vh"
            element.style.outline = `0vh solid ${background}`
            element.style.zIndex = "9999"

            attrTransition(
                element,
                `${timeline}ms ease-out, background .3s ease-out`
            )

            setTimeout(() => {
                element.style.height = ".2vh"
                element.style.outline = `100vh solid ${background}`
                setTimeout(() => {
                    setTimeout(() => {
                        element.style.background = colors[0]
                        setTimeout(() => {
                            onEnd(true)
                            element.remove()
                        }, timeline / 3)
                    }, timeline / 3)

                    element.style.width = "20vw"
                }, timeline / 3)
            }, 50)
            break
        }
        case "otvos": {
            const element = document.createElement("div")
            mainElement.appendChild(element)
            element.style.position = "fixed"
            element.style.left = "-200vw"
            element.style.top = "-200vw"
            element.style.width = "200vw"
            element.style.height = "200vw"
            element.style.background = background
            element.style.zIndex = "9999"
            element.style.transform = "rotate(-45deg)"

            attrTransition(element, `${time / 1000}s ease-in-out`)

            setTimeout(() => {
                element.style.left = "100vw"
                element.style.top = "100vw"
            }, 10)

            setTimeout(() => onEnd(false), time / 2.5)
            setTimeout(() => element.remove(), time + 50)
            break
        }
        case "pixels": {
            transitionOnPixels({
                mainElement,
                time: props.time,
                background: background,
                onChange: () => onEnd(false),
            })
            break
        }
        case "particles": {
            particleTransition({
                mainElement,
                time: props.time,
                background,
                onChange: () => onEnd(false),
            })
            break
        }
        case "melting": {
            meltingTransition({
                mainElement,
                time: props.time,
                background,
                colors,
                onChange: () => onEnd(false),
            })
            break
        }
        case "splash": {
            splashTransition({
                mainElement,
                time: props.time,
                colors: [background, ...colors],
                onChange: () => onEnd(false),
            })
            break
        }
        case "flood": {
            floodTransition({
                mainElement,
                time: props.time,
                background,
                onChange: () => onEnd(false),
            })
            break
        }
        case "paralex": {
            paralexTransition({
                mainElement,
                time: props.time,
                background,
                onChange: () => onEnd(false),
            })
            break
        }
    }
}

const useTransitionOut = (props) => {
    const { mainElement, time, background, colors, type } = props
    const element = document.createElement("div")
    mainElement.appendChild(element)

    switch (type) {
        case "linear": {
            const timeline = time / 2
            element.style.position = "fixed"
            element.style.top = "50%"
            element.style.left = "50%"
            element.style.transform = `translate(-50%,-50%)`
            element.style.width = "20vw"
            element.style.height = ".2vh"
            element.style.outline = `100vh solid ${background}`
            element.style.zIndex = "9999"
            element.style.background = colors[0]

            setTimeout(() => {
                element.style.transition = `${timeline}ms ease-out, background .3s ease-out`
            }, 10)

            setTimeout(() => {
                element.style.width = "100vw"
                element.style.background = "transparent"
                setTimeout(() => {
                    element.style.height = "100vh"
                    element.style.outline = `0vh solid ${background}`
                    setTimeout(() => element.remove(), timeline / 3)
                }, timeline / 3)
            }, timeline / 3)
            break
        }
        case "otvos": {
            break
        }
    }
}

const transitionOnPixels = (props) => {
    const { mainElement, time, onChange, background } = props
    const timeline = time / 2

    const countX: number = 14
    const countY: number = 8

    const PX: number = 100 / countX
    const PY: number = 100 / countY
    const layerElement = document.createElement("div")

    mainElement.appendChild(layerElement)

    layerElement.style.position = "fixed"
    layerElement.style.left = "0px"
    layerElement.style.top = "0px"
    layerElement.style.width = "100vw"
    layerElement.style.height = "100vh"
    layerElement.style.overflow = "hidden"
    layerElement.style.display = "flex"
    layerElement.style.flexWrap = "wrap"
    layerElement.style.zIndex = "999"
    layerElement.style.transform = `translateY(-10vh)`

    let cells = []
    let lastTime = [...new Array(Math.floor(countX))].fill(0)
    let fixTime = 0

    setTimeout(() => onChange(), timeline)

    for (let x = -1; ++x < countY; ) {
        for (let i = -1; ++i < countX; ) {
            const cell = document.createElement("div")

            cells.push(cell)

            cell.dataset.y = String(x)
            cell.dataset.x = String(i)
            cell.style.width = PX + "vw"
            cell.style.height = PY + "vh"
            cell.style.transform = "scale(.1)"
            cell.style.opacity = String(0)
            cell.style.background = background

            const max = timeline / countX

            const timeout = RandomEx(max / 2, max)
            lastTime[i] += timeout

            if (lastTime[i] > fixTime) fixTime = lastTime[i]
            cell.style.transition = `${lastTime[i]}ms ease ${lastTime[i]}ms`

            setTimeout(() => {
                cell.style.transform = "scale(1.1)"
                cell.style.opacity = String(1)
            }, 10)

            setTimeout(() => {
                cell.style.transform = "scale(.1)"
                cell.style.opacity = String(0)
            }, timeline + 50)

            layerElement.append(cell)
        }
    }

    setTimeout(() => layerElement.remove(), time)

    layerElement.style.transition = `${fixTime / 1000}s ease`

    const pageElement = mainElement.querySelector('[style*="display:"]')
    pageElement.style.display = "block"
    pageElement.style.transition = `${fixTime / 1000}s ease-in`

    setTimeout(() => {
        layerElement.style.transform = "translateY(0vh)"
        pageElement.style.transform = "translateY(30vh)"
        pageElement.style.filter = "brightness(120%)"
    }, 30)

    setTimeout(() => {
        const newElementPage = mainElement.lastElementChild
        newElementPage.style.display = "block"
        newElementPage.style.filter = "brightness(120%)"
        newElementPage.style.transform = "translateY(-20vh)"

        setTimeout(() => {
            newElementPage.style.transition = `${fixTime / 1000}s ease-out`
            newElementPage.style.transform = "translateY(0vh)"
            newElementPage.style.filter = "brightness(100%)"
        }, 30)
    }, timeline + 50)
}

const particleTransition = (props) => {
    const { mainElement, time, background, onChange } = props
    const { innerWidth, innerHeight } = window

    const containerElement = document.createElement("div")

    containerElement.style.position = "fixed"
    containerElement.style.left = "0"
    containerElement.style.top = "0"
    containerElement.style.height = "100vh"
    containerElement.style.width = "100vw"
    containerElement.style.zIndex = "999"

    const svgElement = document.createElement("div")
    svgElement.innerHTML = `
    <svg>
        <defs>
            <filter id="displacementFilter5">
                <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.1"
                    numOctaves="3"
                    result="noise"
                ></feTurbulence>
                <feDisplacementMap
                    in="SourceGraphic"
                    in2="noise"
                    scale="150"
                    xChannelSelector="R"
                    yChannelSelector="G"
                ></feDisplacementMap>
            </filter>
        </defs>
    </svg>
    `

    containerElement.appendChild(svgElement)

    const layerElement = document.createElement("div")

    layerElement.style.position = "absolute"
    layerElement.style.width = "0vw"
    layerElement.style.height = "0vw"
    layerElement.style.left = "50%"
    layerElement.style.top = "50%"
    layerElement.style.transform = "translate(-50%,-50%)"
    layerElement.style.filter = "url(#displacementFilter5)"
    layerElement.style.opacity = "0"
    layerElement.style.transition = `${time / 2}ms ease-in-out, opacity ${
        time / 3
    }ms ease-out`

    const boxElement = document.createElement("div")

    boxElement.style.width = "100%"
    boxElement.style.height = "100%"
    boxElement.style.background = background
    boxElement.style.borderRadius = "100%"

    layerElement.appendChild(boxElement)

    containerElement.appendChild(layerElement)
    mainElement.appendChild(containerElement)

    const pageElement = mainElement.querySelector('[style*="display:"]')
    pageElement.style.display = "block"
    pageElement.style.transition = `${time / 3}ms ease-in-out`

    setTimeout(() => {
        layerElement.style.width = "125vw"
        layerElement.style.height = "125vw"
        layerElement.style.opacity = "1"

        pageElement.style.filter = "brightness(150%)"
        pageElement.style.opacity = ".3"
    }, 30)

    setTimeout(() => onChange(), time / 2)

    setTimeout(() => {
        const newElementPage = mainElement.lastElementChild
        newElementPage.style.display = "block"
        newElementPage.style.filter = "brightness(150%)"
        newElementPage.style.opacity = ".3"

        setTimeout(() => {
            newElementPage.style.transition = `${time / 3}ms ease-in-out`
            newElementPage.style.filter = "brightness(100%)"
            newElementPage.style.opacity = "1"
        }, 30)

        layerElement.style.width = "0vw"
        layerElement.style.height = "0vw"
    }, 50 + time / 2)

    setTimeout(() => containerElement.remove(), time + 30)
}

const meltingTransition = (props) => {
    const { mainElement, time, onChange, background, colors } = props
    const element = document.createElement("div")

    const timeline = time / 4

    element.style.position = "fixed"
    element.style.left = "0"
    element.style.top = "0"
    element.style.transform = "scale(1, 1) translateY(-100%)"
    element.style.transition = `${timeline}ms linear`
    element.style.zIndex = "999"

    element.innerHTML = `
<svg width="1926" height="1703" viewBox="0 0 1926 1703" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 71.5632C0 71.5632 70.9988 -21.424 207.5 4.59379C344.001 30.6116 314.499 86.5092 418.5 98.335C522.501 110.161 607.5 22.1901 665 52.845C722.5 83.5 731.999 105.836 852.5 120.5C973.001 135.164 991.499 268.476 1061 290C1130.5 311.524 1175.41 82.2941 1287.5 71.5647C1404.05 60.4083 1481 82.4883 1606.5 98.335C1732 114.182 1707.5 39.8356 1801 30.6116C1894.5 21.3876 1926 140.166 1926 140.166V1596.62C1926 1596.62 1753.5 1603.07 1741 1501.01C1728.5 1398.95 1635 1336.44 1606.5 1438.5C1578 1540.56 1565.26 1491.28 1463.5 1527.99C1392.13 1553.75 1344.05 1492.36 1272.5 1517.44C1173.13 1552.27 1119.5 1555.56 1103 1596.62C1086.5 1637.68 1063.5 1746.19 1002 1682.84C940.5 1619.5 509.348 1515.15 488 1501.01C418.5 1455 418.5 1469 240 1501.01C61.5 1533.03 0 1519 0 1519V71.5632Z" fill="url(#paint0_linear_428_2575)"/>
<defs>
<linearGradient id="paint0_linear_428_2575" x1="1066" y1="65" x2="1074.38" y2="1701.8" gradientUnits="userSpaceOnUse">
<stop stop-color="${background}"/>
<stop offset="1" stop-color="${colors[0]}"/>
</linearGradient>
</defs>
</svg>
    `

    setTimeout(
        () => (element.style.transform = "scale(1, 6) translateY(-45%)"),
        30
    )

    setTimeout(
        () => (element.style.transform = "scale(1, 1) translateY(-20%)"),
        timeline
    )
    setTimeout(
        () => (element.style.transform = "scale(1, 3) translateY(20%)"),
        timeline * 2
    )

    setTimeout(
        () => (element.style.transform = "scale(1, 6) translateY(80%)"),
        timeline * 3
    )

    setTimeout(() => onChange(), time / 2)

    setTimeout(() => element.remove(), time)

    mainElement.appendChild(element)
}

const splashTransition = (props) => {
    const { mainElement, time, onChange, colors } = props

    setTimeout(onChange, time / 2.2)

    const createObject = (direction, rotate, color) => {
        const element = document.createElement("div")

        const timeline = time / 2

        element.style.position = "fixed"
        element.style.transition = `${timeline}ms ease-out`
        if (!direction) {
            element.style.left = "0px"
            element.style.top = "0px"
            element.style.transformOrigin = "left top"
            element.style.transform = `rotate(${rotate}deg) translate(-50%, -100%)`

            setTimeout(() => {
                element.style.transform = `rotate(${rotate}deg) scale(1, 2) translate(-50%, -50%)`
            }, 30)
        } else {
            element.style.right = "0px"
            element.style.bottom = "0px"
            element.style.transformOrigin = "right bottom"
            element.style.transform = `rotate(${rotate}deg) translate(0%, 0%)`

            setTimeout(() => {
                element.style.transform = `rotate(${rotate}deg) scale(1, 3) translate(50%, 50%)`
            }, 30)
        }

        setTimeout(() => (element.style.opacity = "0"), timeline)
        setTimeout(() => element.remove(), time)

        element.style.width = "200vh"
        element.style.height = "200vh"
        element.style.zIndex = "999"

        element.innerHTML = `
<svg width="100%" height="100%" viewBox="0 0 1929 1959" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.5 0H1920.5C1920.5 0 1938.5 1831 1920.5 1920C1902.5 2009 1886.5 1849.5 1863.5 1747C1840.5 1644.5 1804.5 1894.5 1741 1781C1677.5 1667.5 1655 1780.5 1578 1793.5C1501 1806.5 1518 1666.5 1420.5 1705.5C1323 1744.5 1292.5 1874.5 1237 1894.5C1181.5 1914.5 1181 1636.5 1095.5 1726C1010 1815.5 993.5 1739.5 915.5 1756C837.5 1772.5 749.5 1815 738.5 1781C727.5 1747 710 1739.85 662 1747C614 1754.15 657 1860 520 1894.5C383 1929 323 1871 225 1860.5C127 1850 0.5 2035.5 0.5 1920C0.5 1804.5 0.5 0 0.5 0Z" fill="${color}"/>
</svg>`

        mainElement.appendChild(element)
    }

    createObject(true, 100, colors[0])
    createObject(false, -65, colors[1])
}

const floodTransition = (props) => {
    const { mainElement, time, onChange, background } = props
    const element = document.createElement("div")

    const partTime = time / 2

    const timeline = partTime / 4

    const width: number = 1920
    const height: number = 1080

    element.style.position = "fixed"
    element.style.left = "50%"
    element.style.top = "50%"
    element.style.transform = "translate(-50%,-50%)"
    element.style.height = "109vh"
    element.style.width = "191vh"
    element.style.zIndex = "999"

    element.innerHTML = `
    <svg 
    width="100%" 
    height="100%" 
    viewBox="0 0 ${width} ${height}" 
    fill="none"
    >
    <path d="M0 1080 C 0 1080 1080 950 960 950 C 1466 950 1920 1080.0 1920 1080 V 1080 H0 V 1080 Z" 
    fill="${background}"
    style="transition: ${timeline * 3}ms ease-out;"
    />
    </svg>`

    mainElement.appendChild(element)

    setTimeout(onChange, partTime)

    setTimeout(() => {
        const svgElement = element.querySelector("svg")
        const pathElement = svgElement.lastElementChild

        if (pathElement) {
            const set = () =>
                pathElement.setAttribute(
                    "d",
                    `M0 68.5C0 68.5 424 0 960 0C1466 0 1920 68.5 1920 68.5V1079.99H0V68.5Z`
                )

            set()
            setTimeout(set, partTime + 30)

            setTimeout(() => {
                pathElement.setAttribute(
                    "style",
                    `transition: ${timeline * 3}ms ease-out;`
                )
                pathElement.setAttribute(
                    "d",
                    `M0 1080 C 0 1080 1080 1080 960 1080 C 1466 1080 1920 1080.0 1920 1080 V 1080 H0 V 1080 Z`
                )
            }, partTime + timeline)

            setTimeout(() => element.remove(), time)
        }

        setTimeout(() => {
            pathElement.setAttribute(
                "style",
                `transition: ${timeline}ms ease-out;`
            )
            pathElement.setAttribute(
                "d",
                `M0 0C0 0 424 0 945 0C1466 0 1920 0 1920 0V1079.99H0V0Z`
            )
        }, timeline * 3)
    }, 30)
}

const getSvgLayers = () => {
    const layers = [
        [
            [133, 77, 522, 368],
            [711, 77, 1076, 34],
            [711, 134, 1076, 34],
            [711, 191, 1076, 34],
            [711, 261, 1076, 184],
            [133, 481, 1654, 184],
            [133, 688, 1654, 314],
        ],
        [
            [133, 77, 522, 148],
            [1180, 481, 607, 521],
            [711, 77, 1076, 34],
            [711, 134, 1076, 34],
            [711, 191, 1076, 34],
            [133, 261, 1654, 184],
            [133, 481, 1013, 184],
            [133, 688, 1013, 184],
            [133, 895, 1013, 107],
        ],
        [
            [133, 77, 522, 148],
            [1180, 481, 607, 521],
            [711, 77, 1076, 34],
            [711, 134, 1076, 34],
            [711, 191, 1076, 34],
            [1180, 261, 607, 34],
            [1180, 318, 607, 34],
            [1180, 375, 607, 79],
            [133, 261, 1001, 741],
        ],
        [
            [95, 56, 522, 198],
            [95, 290, 522, 230],
            [95, 556, 522, 230],
            [1331, 60, 522, 895],
            [1369, 105, 436, 46],
            [1374, 188, 436, 46],
            [694, 188, 436, 46],
            [694, 648, 436, 46],
            [662, 612, 596, 423],
            [662, 151, 596, 423],
        ],
    ]

    const layer = layers[RandomEx(0, layers.length)]

    let strings = ""

    for (let i = -1; ++i < layer.length; ) {
        strings += `<rect x="${layer[i][0]}" y="${layer[i][1]}" width="${layer[i][2]}" height="${layer[i][3]}" fill="black" fill-opacity="0.11"/>`
    }

    return `
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" fill="none">
        ${strings}
    </svg>
`
}

const paralexTransition = (props) => {
    const { mainElement, background, onChange, time } = props

    const timeline = time / 8

    const startX = -31
    const startY = -32

    const layerElement = document.createElement("div")

    layerElement.style.position = "fixed"
    layerElement.style.width = "100vw"
    layerElement.style.height = "100vh"
    layerElement.style.background = background
    layerElement.style.left = "0"
    layerElement.style.top = "0"
    layerElement.style.zIndex = "998"

    mainElement.appendChild(layerElement)

    const pageElement = mainElement.querySelector('[style*="display:"]')

    pageElement.style.display = "block"
    pageElement.style.position = "fixed"
    pageElement.style.width = "100vw"
    pageElement.style.height = "100vh"
    pageElement.style.left = "0%"
    pageElement.style.top = "0%"
    pageElement.style.overflow = "hidden"
    pageElement.style.transition = `${timeline}ms ease-in-out`
    pageElement.style.zIndex = "1000"

    let elements = []
    let speed = [0, 0, 0]

    const perLine = 20

    let currentIndex = RandomEx(0, 3) * perLine
    currentIndex += RandomEx(1, 4)

    let newIndex = RandomEx(0, 3) * perLine
    newIndex += RandomEx(perLine - 4, perLine - 1)

    const clear = () => {
        elements.forEach((element) => element.remove())
        layerElement.remove()
    }

    for (let i = -1; ++i < perLine * 3; ) {
        let x = i % perLine
        let y = Math.floor(i / perLine)

        const perX = x * 31
        const perY = y * 32

        let element = null

        if (x === 0) speed[y] = RandomEx(20, 40)

        if (currentIndex !== i) {
            element = document.createElement("div")

            elements.push(element)

            element.style.position = "fixed"
            element.style.left = "0"
            element.style.top = "0"
            element.style.width = "100vw"
            element.style.height = "100vh"
            element.style.zIndex = "999"
            element.style.background = `rgb(${RandomEx(40, 150)}, ${RandomEx(
                40,
                255
            )}, ${RandomEx(40, 255)})`
            if (window.innerWidth > 1200) element.innerHTML = getSvgLayers()

            mainElement.appendChild(element)
        } else element = pageElement

        const posX: number = startX + perX
        const posY: number = startY + perY

        element.style.transform = `translate(${
            posX - speed[y]
        }vw,${posY}vh) scale(.3) skewX(-10deg)`

        setTimeout(() => {
            if (x === 0) speed[y] += RandomEx(450, 465)

            element.style.transition = `${timeline * 4}ms ease-in-out`
            element.style.transform = `translate(${
                posX - speed[y]
            }vw,${posY}vh) scale(.3)`

            if (newIndex === i) {
                setTimeout(() => {
                    element.remove()
                    onChange()
                    setTimeout(() => {
                        const newPageElement = mainElement.lastElementChild

                        const speedToX = speed[y] / 2

                        newPageElement.style.display = "block"
                        newPageElement.style.position = "fixed"
                        newPageElement.style.width = "100vw"
                        newPageElement.style.height = "100vh"
                        newPageElement.style.left = "0%"
                        newPageElement.style.top = "0%"
                        newPageElement.style.overflow = "hidden"
                        newPageElement.style.zIndex = "1000"
                        newPageElement.style.transform = `translate(${
                            posX - speedToX
                        }vw,${posY}vh) scale(.3)`
                        newPageElement.style.transition = "none"

                        setTimeout(() => {
                            newPageElement.style.transition = `${
                                timeline * 1.65
                            }ms ease-out`
                            newPageElement.style.transform = `translate(${
                                posX - speed[y]
                            }vw,${posY}vh) scale(.3)`

                            setTimeout(() => {
                                newPageElement.style.transition = `${timeline}ms ease-in-out`
                                newPageElement.style.transform = "none"

                                setTimeout(() => {
                                    clear()
                                    setTimeout(() => {
                                        newPageElement.setAttribute(
                                            "style",
                                            "display:contents"
                                        )
                                    }, 50)
                                }, timeline)
                            }, timeline * 2.5)
                        }, 20)
                    }, 50)
                }, timeline * 2)
            }
        }, timeline + 20)
    }
}

function RandomEx(min, max) {
    return Math.floor(min + Math.random() * (max - min))
}

addPropertyControls(Transition, {
    transition: {
        type: ControlType.Number,
        title: "Transition Time",
        description: "Seconds boss",
        defaultValue: 0.3,
        min: 0.1,
        max: 5,
        step: 0.1,
    },
    background: {
        type: ControlType.Color,
        title: "Background Color",
        defaultValue: "#000",
    },
    color1: {
        type: ControlType.Color,
        title: "Color",
        defaultValue: "#fff",
    },
    type: {
        type: ControlType.Enum,
        title: "Type transition",
        options: [
            "linear",
            "otvos",
            "pixels",
            "particles",
            "melting",
            "splash",
            "flood",
            "paralex",
        ],
    },
})
