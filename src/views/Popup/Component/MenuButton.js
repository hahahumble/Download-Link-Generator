import React, {Fragment} from 'react'
import {Menu, Transition} from '@headlessui/react'
import {Bars3Icon, ArrowTopRightOnSquareIcon} from '@heroicons/react/20/solid'


const menuNavigation = [
  {name: 'Feedback', link: '', action: openFeedback},
  {name: 'Settings', link: '', action: openOptionPage}
]

function openFeedback() {
  chrome.tabs.create({url: "mailto: support@cloudstoragetools.com?subject=Feedback"})
}

function openOptionPage() {
  chrome.tabs.create({url: "chrome-extension://" + chrome.runtime.id + "/options.html"})
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function MenuButton() {
  return (
    <>
      <Menu as="div" className="">
        <div>
          <Menu.Button className="max-w-xs rounded-full flex items-center text-sm">
            <span className="sr-only">Open user menu</span>
            <Bars3Icon
              className="w-5 h-5 fill-gray-500 hover:ring-2 hover:ring-gray-400 hover:ring-offset-2 rounded-full dark:fill-white"/>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-900">
            {menuNavigation.map((item) => (
              <Menu.Item key={item.name}>
                {({active}) => (
                  <div className={classNames(
                    active ? 'bg-gray-100 cursor-pointer dark:bg-gray-700' : '',
                    'block px-4 py-2 text-sm text-gray-700 cursor-pointer dark:text-white'
                  )} onClick={item.action}>
                    <div className="flex flex-row">
                      {item.name}
                      <ArrowTopRightOnSquareIcon className="w-4 h-4 fill-gray-600 ml-2 mt-0.5 dark:fill-white"/>
                    </div>
                  </div>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  )
}

export default MenuButton
